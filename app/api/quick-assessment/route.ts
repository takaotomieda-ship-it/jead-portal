import { Resend } from "resend";

// ==========================================================
// 定数
// ==========================================================

const DOMAIN_KEYS = ["str", "ppl", "prc", "knw", "aic", "fut"] as const;
type DomainKey = (typeof DOMAIN_KEYS)[number];

const DOMAIN_LABELS: Record<DomainKey, string> = {
  str: "戦略",
  ppl: "組織",
  prc: "業務プロセス",
  knw: "知識管理",
  aic: "AI活用",
  fut: "変革準備度",
};

const MAX_LENGTH = {
  short: 200,
  text: 1000,
} as const;

// AI Opportunity Snapshot 用の簡易ルールベース辞書
// （LLMによる自由生成は行わず、固定語彙への照合のみ。恣意的な"診断"に見えることを避けるため）
const OPPORTUNITY_RULES: { tag: string; keywords: string[] }[] = [
  { tag: "知識管理", keywords: ["マニュアル", "手順", "ノウハウ", "引き継ぎ", "属人", "教育", "研修"] },
  { tag: "業務自動化", keywords: ["繰り返し", "手作業", "入力", "集計", "事務", "転記", "作成"] },
  { tag: "経営分析・予測分析", keywords: ["分析", "データ", "数字", "予測", "需要", "在庫", "売上"] },
  { tag: "顧客体験向上", keywords: ["顧客", "接客", "問い合わせ", "対応", "クレーム", "予約"] },
  { tag: "人材育成", keywords: ["採用", "育成", "人材", "評価", "スキル"] },
];

const RATE_LIMIT_WINDOW_MS = 30_000;
const recentSubmissions = new Map<string, number>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const last = recentSubmissions.get(key);
  if (recentSubmissions.size > 500) {
    for (const [k, t] of recentSubmissions) {
      if (now - t > RATE_LIMIT_WINDOW_MS) recentSubmissions.delete(k);
    }
  }
  if (last && now - last < RATE_LIMIT_WINDOW_MS) return true;
  recentSubmissions.set(key, now);
  return false;
}

// ==========================================================
// バリデーション
// ==========================================================

type Payload = {
  industry: string;
  size: string;
  region: string;
  growth: string;
  domainAnswers: Record<DomainKey, number>;
  pain: string;
  aiInterest: string;
  interest: "yes" | "maybe_later" | "no";
  company: string;
  name: string;
  email: string;
  website?: string; // honeypot
};

function getString(d: Record<string, unknown>, key: string): string {
  const v = d[key];
  return typeof v === "string" ? v.trim() : "";
}

function validate(data: unknown): { ok: true; value: Payload } | { ok: false } {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;

  const industry = getString(d, "industry");
  const size = getString(d, "size");
  const region = getString(d, "region");
  const growth = getString(d, "growth");
  const pain = getString(d, "pain");
  const aiInterest = getString(d, "aiInterest");
  const company = getString(d, "company");
  const name = getString(d, "name");
  const email = getString(d, "email");
  const website = getString(d, "website");
  const interestRaw = getString(d, "interest");
  const interest =
    interestRaw === "yes" || interestRaw === "maybe_later" || interestRaw === "no"
      ? interestRaw
      : null;

  if (!industry || !size || !region || !growth || !pain || !company || !name || !email) {
    return { ok: false };
  }
  if (!interest) return { ok: false };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false };

  const fields = [industry, size, region, growth, company, name, email];
  if (fields.some((f) => f.length > MAX_LENGTH.short)) return { ok: false };
  if (pain.length > MAX_LENGTH.text || aiInterest.length > MAX_LENGTH.text) {
    return { ok: false };
  }

  const domainAnswersRaw = d.domainAnswers;
  if (!domainAnswersRaw || typeof domainAnswersRaw !== "object") return { ok: false };
  const domainAnswers = {} as Record<DomainKey, number>;
  for (const key of DOMAIN_KEYS) {
    const v = Number((domainAnswersRaw as Record<string, unknown>)[key]);
    if (!Number.isInteger(v) || v < 1 || v > 5) return { ok: false };
    domainAnswers[key] = v;
  }

  return {
    ok: true,
    value: {
      industry,
      size,
      region,
      growth,
      domainAnswers,
      pain,
      aiInterest,
      interest,
      company,
      name,
      email,
      website,
    },
  };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ==========================================================
// 出力生成ロジック（Initial Management Profile / AI Opportunity Snapshot）
// ==========================================================

function bandLabel(level: number): string {
  if (level <= 2) return "仕組み化の準備段階です";
  if (level === 3) return "仕組み化が進行中です";
  return "仕組み化が定着しています";
}

function buildProfile(domainAnswers: Record<DomainKey, number>) {
  return DOMAIN_KEYS.map((key) => ({
    domain: DOMAIN_LABELS[key],
    band: bandLabel(domainAnswers[key]),
  }));
}

function buildOpportunitySnapshot(pain: string, aiInterest: string, aicLevel: number) {
  const text = `${pain} ${aiInterest}`;
  const matched = OPPORTUNITY_RULES.filter((rule) =>
    rule.keywords.some((kw) => text.includes(kw))
  ).map((rule) => rule.tag);

  const tags = Array.from(new Set(matched));

  const readinessNote =
    aicLevel <= 2
      ? "AI活用はこれからの段階のようです。"
      : aicLevel === 3
        ? "一部での試行段階にあるようです。"
        : "既に一定の活用が進んでいるようです。";

  return { tags, readinessNote };
}

const INTERVIEW_RECOMMENDATION: Record<Payload["interest"], string> = {
  yes: "担当者より1週間以内にご連絡させていただきます。",
  maybe_later: "またあらためてご案内させていただきます。",
  no: "貴重なお時間をいただきありがとうございました。",
};

// ==========================================================
// Route Handler
// ==========================================================

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const v = result.value;

  // Honeypot: 検知を悟らせず、成功したふりで静かに破棄する
  if (v.website) {
    return Response.json({
      ok: true,
      profile: [],
      opportunity: { tags: [], readinessNote: "" },
      recommendation: INTERVIEW_RECOMMENDATION.no,
    });
  }

  if (isRateLimited(v.email.toLowerCase())) {
    return Response.json({ error: "too_many_requests" }, { status: 429 });
  }

  const profile = buildProfile(v.domainAnswers);
  const opportunity = buildOpportunitySnapshot(v.pain, v.aiInterest, v.domainAnswers.aic);
  const recommendation = INTERVIEW_RECOMMENDATION[v.interest];

  // 事務局への通知メール送信（Resend）。送信に失敗しても、結果自体は利用者へ返す
  // （簡易調査の主目的は利用者への即時フィードバックであり、通知メール送信の成否で
  //   利用者の体験をブロックしない）。
  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.JEAD_NOTIFICATION_EMAIL;
  const fromEmail = process.env.JEAD_FROM_EMAIL;

  let notified = false;
  if (apiKey && notificationEmail && fromEmail) {
    try {
      const resend = new Resend(apiKey);
      const interestLabel =
        v.interest === "yes"
          ? "経営者面談を希望"
          : v.interest === "maybe_later"
            ? "興味あり（時期未定）"
            : "現時点では見送り";

      const subject = `【JEAD簡易調査】${v.company}（${interestLabel}）`;

      const textLines = [
        `会社名：${v.company}`,
        `お名前：${v.name}`,
        `メールアドレス：${v.email}`,
        `業種：${v.industry}／規模：${v.size}／地域：${v.region}／成長：${v.growth}`,
        "",
        "【経営状況スナップショット】",
        ...profile.map((p) => `${p.domain}：${p.band}`),
        "",
        `【最も手間がかかっている作業】${v.pain}`,
        `【AIを使ってみたい業務】${v.aiInterest || "（なし）"}`,
        "",
        `【AI機会スナップショット】${opportunity.tags.join("、") || "（該当なし）"}／${opportunity.readinessNote}`,
        "",
        `【面談意向】${interestLabel}`,
      ];

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: notificationEmail,
        replyTo: v.email,
        subject,
        text: textLines.join("\n"),
        html: `<pre style="font-family: sans-serif; font-size: 14px;">${escapeHtml(
          textLines.join("\n")
        )}</pre>`,
      });

      if (sendError) {
        console.error(
          "[api/quick-assessment] Resend returned an error:",
          sendError.name,
          sendError.message
        );
      } else {
        notified = true;
      }
    } catch (err) {
      console.error(
        "[api/quick-assessment] Failed to send notification email:",
        err instanceof Error ? err.message : "unknown"
      );
      // 通知メール失敗は利用者へのレスポンスをブロックしない
    }
  } else {
    console.error("[api/quick-assessment] Notification email not configured; skipping send");
  }

  return Response.json({ ok: true, profile, opportunity, recommendation, notified });
}

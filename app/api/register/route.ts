import { Resend } from "resend";

// ==========================================================
// 定数・設定
// ==========================================================

const MAX_LENGTH = {
  company: 200,
  name: 100,
  position: 100,
  industry: 100,
  email: 254,
  message: 3000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 簡易的な連打防止（同一プロセス内のみ有効なメモリキャッシュ。
// サーバーレス環境ではインスタンスごとに独立するため完全な保証にはならないが、
// 同一ウォームインスタンスへの短時間の連続送信は抑止できる）
const RATE_LIMIT_WINDOW_MS = 30_000;
const recentSubmissions = new Map<string, number>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const last = recentSubmissions.get(key);

  // 古いエントリを間引く（メモリリーク防止）
  if (recentSubmissions.size > 500) {
    for (const [k, t] of recentSubmissions) {
      if (now - t > RATE_LIMIT_WINDOW_MS) recentSubmissions.delete(k);
    }
  }

  if (last && now - last < RATE_LIMIT_WINDOW_MS) {
    return true;
  }
  recentSubmissions.set(key, now);
  return false;
}

// ==========================================================
// 型・バリデーション
// ==========================================================

type RegisterPayload = {
  company: string;
  name: string;
  position: string;
  industry: string;
  email: string;
  message?: string;
  requestType: "registration" | "interview";
  website?: string; // honeypot（人間には見えない項目。値が入っていればbot判定）
};

function getString(data: Record<string, unknown>, key: string): string {
  const v = data[key];
  return typeof v === "string" ? v.trim() : "";
}

function validate(data: unknown):
  | { ok: true; value: RegisterPayload }
  | { ok: false; reason: string } {
  if (!data || typeof data !== "object") {
    return { ok: false, reason: "invalid_body" };
  }
  const d = data as Record<string, unknown>;

  const company = getString(d, "company");
  const name = getString(d, "name");
  const position = getString(d, "position");
  const industry = getString(d, "industry");
  const email = getString(d, "email");
  const message = getString(d, "message");
  const website = getString(d, "website");
  const requestType = d.requestType === "interview" ? "interview" : "registration";

  if (!company || !name || !position || !industry || !email) {
    return { ok: false, reason: "missing_required_field" };
  }

  if (
    company.length > MAX_LENGTH.company ||
    name.length > MAX_LENGTH.name ||
    position.length > MAX_LENGTH.position ||
    industry.length > MAX_LENGTH.industry ||
    email.length > MAX_LENGTH.email ||
    message.length > MAX_LENGTH.message
  ) {
    return { ok: false, reason: "field_too_long" };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, reason: "invalid_email" };
  }

  return {
    ok: true,
    value: { company, name, position, industry, email, message, requestType, website },
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

  const { company, name, position, industry, email, message, requestType, website } =
    result.value;

  // Honeypot: botが埋めていれば、検知したことを悟らせず「成功したふり」で静かに破棄する
  if (website) {
    return Response.json({ ok: true });
  }

  // 簡易連打防止（メールアドレス単位）
  const rateLimitKey = email.toLowerCase();
  if (isRateLimited(rateLimitKey)) {
    return Response.json({ error: "too_many_requests" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.JEAD_NOTIFICATION_EMAIL;
  const fromEmail = process.env.JEAD_FROM_EMAIL;

  if (!apiKey || !notificationEmail || !fromEmail) {
    console.error(
      "[api/register] Missing required environment variables (RESEND_API_KEY / JEAD_NOTIFICATION_EMAIL / JEAD_FROM_EMAIL)"
    );
    return Response.json({ error: "server_not_configured" }, { status: 500 });
  }

  const subject =
    requestType === "interview"
      ? `【JEAD】経営者面談のご希望（${company}）`
      : `【JEAD】研究登録（${company}）`;

  const textBody = [
    `会社名：${company}`,
    `お名前：${name}`,
    `ご役職：${position}`,
    `業種：${industry}`,
    `メールアドレス：${email}`,
    "",
    `ご希望内容：${
      requestType === "interview"
        ? "経営者面談（Executive Interview）"
        : "研究登録（Research Registration）"
    }`,
    "",
    "メッセージ：",
    message || "（なし）",
  ].join("\n");

  const htmlBody = `
    <div style="font-family: sans-serif; font-size: 14px; color: #1f2430; line-height: 1.7;">
      <table cellpadding="4" cellspacing="0">
        <tr><td><strong>会社名</strong></td><td>${escapeHtml(company)}</td></tr>
        <tr><td><strong>お名前</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>ご役職</strong></td><td>${escapeHtml(position)}</td></tr>
        <tr><td><strong>業種</strong></td><td>${escapeHtml(industry)}</td></tr>
        <tr><td><strong>メールアドレス</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>ご希望内容</strong></td><td>${
          requestType === "interview"
            ? "経営者面談（Executive Interview）"
            : "研究登録（Research Registration）"
        }</td></tr>
      </table>
      <p><strong>メッセージ：</strong><br />${
        message ? escapeHtml(message).replace(/\n/g, "<br />") : "（なし）"
      }</p>
    </div>
  `.trim();

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      console.error("[api/register] Resend returned an error:", error.name);
      return Response.json({ error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error(
      "[api/register] Unexpected error while sending email:",
      err instanceof Error ? err.message : "unknown"
    );
    return Response.json({ error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

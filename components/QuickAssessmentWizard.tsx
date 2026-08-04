"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_QUESTIONS } from "@/lib/quickAssessmentQuestions";

type Answers = Record<string, string>;

type ResultData = {
  profile: { domain: string; band: string }[];
  opportunity: { tags: string[]; readinessNote: string };
  recommendation: string;
};

const TOTAL_STEPS = ALL_QUESTIONS.length + 1; // +1 = 最終ステップ（連絡先・意向確認）

export default function QuickAssessmentWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({ company: "", name: "", email: "" });
  const [interest, setInterest] = useState<"yes" | "maybe_later" | "no" | "">("");
  const [website, setWebsite] = useState(""); // honeypot
  const [phase, setPhase] = useState<"form" | "submitting" | "results">("form");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);

  const isFinalStep = stepIndex === ALL_QUESTIONS.length;
  const currentQuestion = isFinalStep ? null : ALL_QUESTIONS[stepIndex];

  function canProceed(): boolean {
    if (isFinalStep) {
      return Boolean(contact.company && contact.name && contact.email && interest);
    }
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    return Boolean(answers[currentQuestion.id]);
  }

  function handleNext() {
    if (!canProceed()) return;
    if (isFinalStep) {
      void handleSubmit();
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function handleBack() {
    setError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  async function handleSubmit() {
    setError(null);
    setPhase("submitting");

    const payload = {
      industry: answers.industry,
      size: answers.size,
      region: answers.region,
      growth: answers.growth,
      domainAnswers: {
        str: Number(answers.str),
        ppl: Number(answers.ppl),
        prc: Number(answers.prc),
        knw: Number(answers.knw),
        aic: Number(answers.aic),
        fut: Number(answers.fut),
      },
      pain: answers.pain,
      aiInterest: answers.aiInterest ?? "",
      interest,
      company: contact.company,
      name: contact.name,
      email: contact.email,
      website,
    };

    try {
      const res = await fetch("/api/quick-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as ResultData;
      setResult(data);
      setPhase("results");
    } catch {
      setError(
        "送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、お問い合わせページより直接ご連絡ください。"
      );
      setPhase("form");
    }
  }

  if (phase === "results" && result) {
    return <ResultsView result={result} />;
  }

  return (
    <div>
      <ProgressBar current={stepIndex + 1} total={TOTAL_STEPS} />

      <div className="mt-8">
        {isFinalStep ? (
          <FinalStep
            contact={contact}
            setContact={setContact}
            interest={interest}
            setInterest={setInterest}
            website={website}
            setWebsite={setWebsite}
          />
        ) : (
          currentQuestion && (
            <QuestionStep
              question={currentQuestion}
              value={answers[currentQuestion.id] ?? ""}
              onChange={(v) =>
                setAnswers((a) => ({ ...a, [currentQuestion.id]: v }))
              }
            />
          )
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={stepIndex === 0 || phase === "submitting"}
          className="text-sm text-jead-muted underline underline-offset-4 disabled:opacity-0"
        >
          戻る
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed() || phase === "submitting"}
          className="rounded-sm bg-jead-navy px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-jead-navy-light disabled:opacity-40"
        >
          {phase === "submitting" ? "送信中…" : isFinalStep ? "結果を見る" : "次へ"}
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-jead-muted">
        <span>
          {current} / {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-jead-line">
        <div
          className="h-1.5 rounded-full bg-jead-gold transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function QuestionStep({
  question,
  value,
  onChange,
}: {
  question: (typeof ALL_QUESTIONS)[number];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold leading-relaxed text-jead-navy sm:text-lg">
        {question.title}
      </h2>

      {question.type === "select" && question.options && (
        <div className="mt-5 space-y-2">
          {question.options.map((opt) => (
            <label
              key={opt.value}
              className={`block cursor-pointer rounded-sm border px-4 py-3 text-sm transition-colors ${
                value === opt.value
                  ? "border-jead-navy bg-jead-navy/5 text-jead-navy"
                  : "border-jead-line bg-white text-jead-ink hover:border-jead-navy/40"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                className="mr-2 align-middle"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}

      {question.type === "text" && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder={question.placeholder}
          className="jead-input mt-5 resize-none"
        />
      )}

      {!question.required && (
        <p className="mt-2 text-xs text-jead-muted">（任意回答です）</p>
      )}
    </div>
  );
}

function FinalStep({
  contact,
  setContact,
  interest,
  setInterest,
  website,
  setWebsite,
}: {
  contact: { company: string; name: string; email: string };
  setContact: (v: { company: string; name: string; email: string }) => void;
  interest: "yes" | "maybe_later" | "no" | "";
  setInterest: (v: "yes" | "maybe_later" | "no") => void;
  website: string;
  setWebsite: (v: string) => void;
}) {
  const INTEREST_OPTIONS: { value: "yes" | "maybe_later" | "no"; label: string }[] = [
    { value: "yes", label: "ぜひ参加したい" },
    { value: "maybe_later", label: "興味はあるが今はタイミングが合わない" },
    { value: "no", label: "今回は見送りたい" },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold text-jead-navy sm:text-lg">
        最後に、ご連絡先を教えてください
      </h2>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
      >
        <label>
          ウェブサイト
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-jead-ink">
          会社名<span className="ml-1 text-jead-gold">*</span>
        </span>
        <input
          type="text"
          className="jead-input"
          maxLength={200}
          value={contact.company}
          onChange={(e) => setContact({ ...contact, company: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-jead-ink">
          お名前<span className="ml-1 text-jead-gold">*</span>
        </span>
        <input
          type="text"
          className="jead-input"
          maxLength={100}
          value={contact.name}
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-jead-ink">
          メールアドレス<span className="ml-1 text-jead-gold">*</span>
        </span>
        <input
          type="email"
          className="jead-input"
          maxLength={254}
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
        />
      </label>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-jead-ink">
          今後、経営者面談（60〜90分程度）にご関心はありますか
          <span className="ml-1 text-jead-gold">*</span>
        </span>
        <div className="mt-2 space-y-2">
          {INTEREST_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`block cursor-pointer rounded-sm border px-4 py-3 text-sm transition-colors ${
                interest === opt.value
                  ? "border-jead-navy bg-jead-navy/5 text-jead-navy"
                  : "border-jead-line bg-white text-jead-ink hover:border-jead-navy/40"
              }`}
            >
              <input
                type="radio"
                name="interest"
                value={opt.value}
                checked={interest === opt.value}
                onChange={() => setInterest(opt.value)}
                className="mr-2 align-middle"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-jead-muted">
        ご入力いただいた情報は
        <a href="/ethics" className="mx-1 underline underline-offset-4">
          研究倫理
        </a>
        に基づき取り扱います。営業目的での利用は一切ございません。
      </p>
    </div>
  );
}

function ResultsView({ result }: { result: ResultData }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-widest text-jead-gold">
          RESULT
        </p>
        <h2 className="mt-2 text-xl font-bold text-jead-navy">
          簡易調査 結果
        </h2>
      </div>

      <section>
        <h3 className="text-sm font-bold text-jead-navy">
          貴社の経営基盤スナップショット
        </h3>
        <div className="mt-3 divide-y divide-jead-line rounded-sm border border-jead-line bg-white">
          {result.profile.map((p) => (
            <div key={p.domain} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-jead-muted">{p.domain}</span>
              <span className="font-medium text-jead-navy">{p.band}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-jead-muted">
          ※ 本結果は簡易自己診断であり、正式な経営診断（経営者面談）とは測定方法が異なります。
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-jead-navy">
          AI活用の可能性（簡易スナップショット）
        </h3>
        <div className="mt-3 rounded-sm border border-jead-line bg-white px-4 py-4">
          {result.opportunity.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.opportunity.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-jead-gold/15 px-3 py-1 text-xs font-semibold text-jead-gold"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-jead-muted">
              いただいた回答からは特定の領域を判定できませんでした。
            </p>
          )}
          <p className="mt-3 text-sm text-jead-ink">{result.opportunity.readinessNote}</p>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-jead-muted">
          ※ これは自由記述の内容に基づく参考情報であり、確定的な診断ではありません。
        </p>
      </section>

      <section className="rounded-sm border border-jead-line bg-jead-navy/5 px-5 py-5">
        <p className="text-sm text-jead-navy">{result.recommendation}</p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-sm border border-jead-line px-6 py-2.5 text-center text-sm font-medium text-jead-navy hover:bg-jead-paper"
        >
          トップページへ戻る
        </Link>
        <Link
          href="/register?type=interview"
          className="rounded-sm bg-jead-navy px-6 py-2.5 text-center text-sm font-medium text-white hover:bg-jead-navy-light"
        >
          経営者面談を申し込む
        </Link>
      </div>
    </div>
  );
}

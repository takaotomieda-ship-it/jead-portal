"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const INDUSTRIES = [
  "製造業",
  "卸売・貿易業",
  "物流・運輸業",
  "医療・福祉業",
  "建設業",
  "宿泊・飲食業",
  "その他サービス業",
  "その他",
];

const MAX_LENGTH = {
  company: 200,
  name: 100,
  position: 100,
  industry: 100,
  email: 254,
  message: 3000,
} as const;

export default function RegisterForm({
  initialType,
}: {
  initialType: "registration" | "interview";
}) {
  const router = useRouter();
  const requestType = initialType;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 二重送信防止（連打・非同期処理中の再送信をブロック）
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      company: String(data.get("company") ?? ""),
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      position: String(data.get("position") ?? ""),
      industry: String(data.get("industry") ?? ""),
      message: String(data.get("message") ?? ""),
      requestType,
      // Honeypot: 人間には見えない項目。botがここに値を入れると送信を静かに破棄する
      website: String(data.get("website") ?? ""),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`request failed: ${res.status}`);
      }

      router.push("/thank-you");
    } catch {
      setError(
        "送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、お問い合わせページより直接ご連絡ください。"
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-sm border border-jead-line bg-jead-navy/5 px-4 py-3 text-sm text-jead-navy">
        {requestType === "interview"
          ? "経営者面談（Executive Interview）へのお申し込みとして承ります。"
          : "研究登録（Research Registration）として承ります。"}
      </div>

      {/* Honeypot field: 視覚的に隠し、スクリーンリーダーからも除外する。
          実在の利用者は入力しない前提の項目。 */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label>
          ウェブサイト
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <Field label="会社名" required>
        <input
          name="company"
          type="text"
          required
          maxLength={MAX_LENGTH.company}
          className="jead-input"
          placeholder="株式会社◯◯"
        />
      </Field>

      <Field label="お名前" required>
        <input
          name="name"
          type="text"
          required
          maxLength={MAX_LENGTH.name}
          className="jead-input"
          placeholder="山田 太郎"
        />
      </Field>

      <Field label="ご役職" required>
        <input
          name="position"
          type="text"
          required
          maxLength={MAX_LENGTH.position}
          className="jead-input"
          placeholder="代表取締役"
        />
      </Field>

      <Field label="業種" required>
        <select name="industry" required defaultValue="" className="jead-input">
          <option value="" disabled>
            選択してください
          </option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </Field>

      <Field label="メールアドレス" required>
        <input
          name="email"
          type="email"
          required
          maxLength={MAX_LENGTH.email}
          className="jead-input"
          placeholder="you@example.com"
        />
      </Field>

      <Field label="メッセージ（任意）">
        <textarea
          name="message"
          rows={4}
          maxLength={MAX_LENGTH.message}
          className="jead-input resize-none"
          placeholder="ご質問やご要望があればご記入ください"
        />
      </Field>

      <p className="text-xs leading-relaxed text-jead-muted">
        送信いただいた内容は、運営事務局（info@everlink-el.jp）宛に送付されます。ご入力いただいた情報は
        <a href="/ethics" className="mx-1 underline underline-offset-4">
          研究倫理
        </a>
        に基づき取り扱います。
      </p>

      {error && (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-jead-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-jead-navy-light disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-jead-ink">
        {label}
        {required && <span className="ml-1 text-jead-gold">*</span>}
      </span>
      {children}
    </label>
  );
}

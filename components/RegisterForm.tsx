"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const CONTACT_EMAIL = "contact@jead-research.example.jp";

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

export default function RegisterForm({
  initialType,
}: {
  initialType: "registration" | "interview";
}) {
  const router = useRouter();
  const requestType = initialType;

  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const company = String(data.get("company") ?? "");
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const position = String(data.get("position") ?? "");
    const industry = String(data.get("industry") ?? "");
    const message = String(data.get("message") ?? "");

    const subject =
      requestType === "interview"
        ? `【JEAD】経営者面談のご希望（${company}）`
        : `【JEAD】研究登録（${company}）`;

    const bodyLines = [
      `会社名：${company}`,
      `お名前：${name}`,
      `ご役職：${position}`,
      `業種：${industry}`,
      `メールアドレス：${email}`,
      "",
      `ご希望内容：${
        requestType === "interview" ? "経営者面談（Executive Interview）" : "研究登録（Research Registration）"
      }`,
      "",
      "メッセージ：",
      message || "（なし）",
    ];

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailtoUrl;
    router.push("/thank-you");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-sm border border-jead-line bg-jead-navy/5 px-4 py-3 text-sm text-jead-navy">
        {requestType === "interview"
          ? "経営者面談（Executive Interview）へのお申し込みとして承ります。"
          : "研究登録（Research Registration）として承ります。"}
      </div>

      <Field label="会社名" required>
        <input
          name="company"
          type="text"
          required
          className="jead-input"
          placeholder="株式会社◯◯"
        />
      </Field>

      <Field label="お名前" required>
        <input
          name="name"
          type="text"
          required
          className="jead-input"
          placeholder="山田 太郎"
        />
      </Field>

      <Field label="ご役職" required>
        <input
          name="position"
          type="text"
          required
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
          className="jead-input"
          placeholder="you@example.com"
        />
      </Field>

      <Field label="メッセージ（任意）">
        <textarea
          name="message"
          rows={4}
          className="jead-input resize-none"
          placeholder="ご質問やご要望があればご記入ください"
        />
      </Field>

      <p className="text-xs leading-relaxed text-jead-muted">
        送信すると、お使いのメールアプリが開きご入力内容が反映されます。内容をご確認のうえ、
        そのまま送信してください。ご入力いただいた情報は
        <a href="/ethics" className="mx-1 underline underline-offset-4">
          研究倫理
        </a>
        に基づき取り扱います。
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-jead-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-jead-navy-light disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "送信準備中…" : "送信する"}
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

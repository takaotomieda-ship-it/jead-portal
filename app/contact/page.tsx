import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "お問い合わせ | JEAD",
  description: "JEADへのお問い合わせ方法。",
};

const CONTACT_EMAIL = "contact@jead-research.example.jp";

export default function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="CONTACT"
        title="お問い合わせ"
        lede="本調査に関するご質問・ご懸念がございましたら、お気軽にご連絡ください。"
      />

      <Container className="space-y-6 py-14">
        <div className="rounded-sm border border-jead-line bg-white p-6 sm:p-8">
          <h2 className="text-sm font-bold text-jead-navy">
            メールでのお問い合わせ
          </h2>
          <p className="mt-2 text-sm text-jead-muted">
            下記アドレスまで直接ご連絡いただけます。通常3営業日以内にご返信いたします。
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-block text-sm font-medium text-jead-navy underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="rounded-sm border border-jead-line bg-white p-6 sm:p-8">
          <h2 className="text-sm font-bold text-jead-navy">運営事務局</h2>
          <p className="mt-2 text-sm leading-relaxed text-jead-muted">
            ［運営主体名］
            <br />
            ［所在地：準備中］
            <br />
            ［電話番号：準備中］
          </p>
          <p className="mt-3 text-xs text-jead-muted">
            ※ 事務局の詳細情報は準備中です。当面はメールにてご連絡ください。
          </p>
        </div>

        <div className="rounded-sm border border-jead-line bg-white p-6 sm:p-8">
          <h2 className="text-sm font-bold text-jead-navy">
            経営者面談のご希望
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-jead-muted">
            経営者面談（Executive Interview）への参加をご希望の場合は、登録フォームより
            お申し込みください。担当者よりご連絡のうえ、日程を調整いたします。
          </p>
          <Link
            href="/register?type=interview"
            className="mt-4 inline-block rounded-sm bg-jead-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-jead-navy-light"
          >
            面談を希望する
          </Link>
        </div>
      </Container>
    </div>
  );
}

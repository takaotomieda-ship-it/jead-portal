import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "ご登録ありがとうございます | JEAD",
  description: "JEADへのご登録が完了しました。",
};

export default function ThankYouPage() {
  return (
    <section className="bg-white">
      <Container className="flex flex-col items-center py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-jead-navy text-2xl text-white">
          ✓
        </span>
        <h1 className="mt-6 text-xl font-bold text-jead-navy sm:text-2xl">
          ご登録ありがとうございます
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-jead-muted sm:text-base">
          JEADへのご関心をお寄せいただき、誠にありがとうございます。
          お使いのメールアプリで送信を完了してください。担当者より追ってご連絡いたします。
        </p>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-jead-muted">
          メールアプリが自動的に開かなかった場合は、
          <Link href="/contact" className="underline underline-offset-4">
            お問い合わせページ
          </Link>
          より直接ご連絡ください。
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-sm border border-jead-line px-6 py-2.5 text-sm font-medium text-jead-navy hover:bg-jead-paper"
          >
            トップページへ戻る
          </Link>
          <Link
            href="/about"
            className="rounded-sm bg-jead-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-jead-navy-light"
          >
            JEADについてもっと知る
          </Link>
        </div>
      </Container>
    </section>
  );
}

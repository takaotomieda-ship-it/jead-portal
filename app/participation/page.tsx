import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "研究参加 | JEAD",
  description: "JEADへの3つの参加方法についてご案内します。",
};

export default function ParticipationPage() {
  return (
    <div>
      <PageHero
        eyebrow="RESEARCH PARTICIPATION"
        title="研究への参加方法"
        lede="貴社のご都合に応じて、3つの参加方法からお選びいただけます。無理に段階を進める必要はありません。"
      />

      <Container className="space-y-6 py-14">
        <PathCard
          step="1"
          title="研究登録（Research Registration）"
          status="受付中"
          statusTone="active"
          time="1〜2分"
          body="まずは関心の登録のみ。会社名・お名前・ご連絡先を送っていただければ、今後の研究の進捗や参加方法について改めてご案内します。この時点でのご回答は必要ありません。"
          cta={{ label: "登録する", href: "/register?type=registration" }}
        />

        <PathCard
          step="2"
          title="簡易調査（Quick Assessment）"
          status="近日公開"
          statusTone="soon"
          time="10〜15分（予定）"
          body="オンラインで完結する簡易的な経営スナップショット調査です。現在準備中のため、公開まで今しばらくお待ちください。"
        />

        <PathCard
          step="3"
          title="経営者面談（Executive Interview／Core40）"
          status="応募受付中"
          statusTone="active"
          time="60〜90分"
          body="研究員との対話形式で、貴社の経営基盤について標準化された調査（Core40）にご協力いただきます。外部視点からの経営整理の機会としてもご活用いただけます。"
          cta={{ label: "面談を希望する", href: "/register?type=interview" }}
        />

        <p className="pt-4 text-xs leading-relaxed text-jead-muted">
          ※ どの方法から始めていただいても構いません。段階を飛ばして経営者面談を直接ご希望
          いただくことも可能です。参加は完全に任意で、費用は一切かかりません。詳しくは
          <Link href="/ethics" className="mx-1 underline underline-offset-4">
            研究倫理
          </Link>
          をご覧ください。
        </p>
      </Container>
    </div>
  );
}

function PathCard({
  step,
  title,
  status,
  statusTone,
  time,
  body,
  cta,
}: {
  step: string;
  title: string;
  status: string;
  statusTone: "active" | "soon";
  time: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="rounded-sm border border-jead-line bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jead-navy text-xs font-bold text-white">
          {step}
        </span>
        <h2 className="text-base font-bold text-jead-navy sm:text-lg">
          {title}
        </h2>
        <span
          className={`ml-auto rounded-sm px-2.5 py-1 text-xs font-semibold ${
            statusTone === "active"
              ? "bg-jead-gold/15 text-jead-gold"
              : "bg-jead-ink/10 text-jead-muted"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-4 text-xs font-medium text-jead-muted">
        所要時間：{time}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-jead-muted sm:text-base">
        {body}
      </p>

      {cta ? (
        <Link
          href={cta.href}
          className="mt-5 inline-block rounded-sm bg-jead-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-jead-navy-light"
        >
          {cta.label}
        </Link>
      ) : (
        <span className="mt-5 inline-block rounded-sm border border-jead-line px-5 py-2.5 text-sm font-medium text-jead-muted">
          準備中です
        </span>
      )}
    </div>
  );
}

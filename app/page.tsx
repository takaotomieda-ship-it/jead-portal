import Link from "next/link";
import Container from "@/components/Container";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-jead-line bg-jead-navy text-white">
        <Container className="py-20 sm:py-28">
          <p className="text-sm tracking-widest text-jead-gold">
            JAPAN ENTERPRISE AI DATABASE
          </p>
          <h1 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
            日本企業のAI経営基盤を記録する、
            <br />
            日本初の標準化された研究プロジェクト
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            JEADは、業種・規模を問わず同一の調査基準を用いて企業の経営基盤を体系的に記録し、
            将来の「企業AI競争力の標準的な指標（EACS）」の礎となることを目指す、
            長期の学術的研究プロジェクトです。特定の商品・サービスの販売は一切行いません。
          </p>
          <div className="mt-9">
            <Link
              href="/register"
              className="inline-block rounded-sm bg-jead-gold px-7 py-3 text-sm font-semibold text-jead-navy transition-opacity hover:opacity-90"
            >
              研究に参加する
            </Link>
          </div>
        </Container>
      </section>

      {/* Trust signals */}
      <section className="border-b border-jead-line bg-white">
        <Container className="grid grid-cols-1 gap-6 py-10 sm:grid-cols-3">
          <TrustItem
            title="学術的アプローチ"
            body="経営学・調査方法論の専門的知見に基づいて設計。"
          />
          <TrustItem
            title="完全匿名化"
            body="企業が特定される形での公表は一切ありません。"
          />
          <TrustItem
            title="営業目的ではありません"
            body="ご参加に費用は一切かからず、勧誘も行いません。"
          />
        </Container>
      </section>

      {/* Why this research exists */}
      <section className="bg-jead-paper">
        <Container className="py-16">
          <h2 className="text-lg font-bold text-jead-navy">
            なぜこの研究が必要か
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-jead-muted sm:text-base">
            多くの企業がAI活用について検討・模索していますが、その実態を横断的・統一的な基準で
            把握したデータベースは、日本にはまだ存在していません。「AIをどれだけ使っているか」だけを
            測る調査は数多くある一方、「AIを活かせる経営基盤がどれだけ整っているか」を測る調査は
            ほとんど存在しません。JEADはこの空白を埋めることを目的としています。
          </p>
          <Link
            href="/about"
            className="mt-5 inline-block text-sm font-medium text-jead-navy underline underline-offset-4"
          >
            JEADについて詳しく見る →
          </Link>
        </Container>
      </section>

      {/* Mission */}
      <section className="border-t border-jead-line bg-white">
        <Container className="py-16">
          <h2 className="text-lg font-bold text-jead-navy">研究のミッション</h2>
          <p className="mt-4 text-sm leading-relaxed text-jead-muted sm:text-base">
            JEADは、単発のアンケート調査ではありません。10年以上にわたり継続することを前提に
            設計された、長期的な企業研究データベースです。ご参加いただいた企業様は「調査対象」ではなく、
            この研究基盤を共に作る「リサーチパートナー」です。
          </p>
          <Link
            href="/participation"
            className="mt-5 inline-block text-sm font-medium text-jead-navy underline underline-offset-4"
          >
            参加方法を見る →
          </Link>
        </Container>
      </section>
    </div>
  );
}

function TrustItem({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-jead-navy">{title}</p>
      <p className="mt-1 text-sm text-jead-muted">{body}</p>
    </div>
  );
}

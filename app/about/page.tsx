import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "JEADとは | JEAD",
  description: "JEADの研究目的・長期ビジョン・将来のEACSとの関係について。",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="ABOUT JEAD"
        title="JEADとは"
        lede="日本企業のAI経営競争力に関する、日本で初めての体系的な研究プロジェクトです。"
      />

      <Container className="space-y-12 py-14">
        <Section title="研究目的">
          <p>
            現在、多くの企業がAI活用について検討・模索していますが、その実態を横断的・統一的な
            基準で把握したデータベースは、日本にはまだ存在していません。JEADは、業種・規模を
            問わず同一の調査基準（Core40）を用いて企業の経営基盤を記録し、将来にわたって
            参照可能な研究資産を構築します。
          </p>
        </Section>

        <Section title="長期ビジョン">
          <p>
            JEADは、単発のアンケート調査ではありません。10年以上にわたり継続することを前提に
            設計された、長期的な企業研究データベースです。
          </p>
          <ul className="mt-4 space-y-2 text-sm text-jead-muted sm:text-base">
            <li>
              <span className="font-semibold text-jead-ink">Version 1　</span>
              100社規模での基盤構築（現在のフェーズ）
            </li>
            <li>
              <span className="font-semibold text-jead-ink">Version 2　</span>
              500社規模への拡大
            </li>
            <li>
              <span className="font-semibold text-jead-ink">長期目標　</span>
              1,000社以上の参加による、代表性の高い研究基盤の確立
            </li>
          </ul>
        </Section>

        <Section title="将来のEACSとの関係">
          <p>
            蓄積されたデータは、将来的に「企業AI競争力の標準的評価指標（EACS：Enterprise AI
            Competitiveness Standard）」の学術的基盤として活用されることを目指しています。
            日本企業AI経営白書やベンチマーク指標も、参加企業様の匿名化されたデータの
            積み重ねによって初めて実現するものです。
          </p>
        </Section>

        <Section title="研究原則">
          <ul className="mt-2 space-y-2 text-sm text-jead-muted sm:text-base">
            <li>・ 目的の限定 — 学術的・統計的な研究目的にのみ使用します</li>
            <li>・ 匿名化の徹底 — 企業が特定される形での公表は行いません</li>
            <li>・ 任意性 — ご参加・回答は完全に任意です</li>
            <li>・ 中立性 — 特定の結論に誘導する質問は行いません</li>
          </ul>
          <Link
            href="/ethics"
            className="mt-5 inline-block text-sm font-medium text-jead-navy underline underline-offset-4"
          >
            研究倫理について詳しく見る →
          </Link>
        </Section>
      </Container>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base font-bold text-jead-navy sm:text-lg">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-jead-muted sm:text-base">
        {children}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "研究倫理 | JEAD",
  description: "JEADが遵守する研究倫理・データ保護・参加者の権利について。",
};

const ITEMS = [
  {
    title: "秘密保持（Confidentiality）",
    body: "ご回答内容は匿名化して管理し、貴社名を明らかにした形で外部に公表することはございません。",
  },
  {
    title: "同意（Consent）",
    body: "ご参加前に、データの利用目的・取り扱い方法について書面でご説明し、ご同意をいただいた上で調査を開始します。",
  },
  {
    title: "匿名統計分析（Anonymous Statistical Analysis）",
    body: "分析結果を公表する際は、業種・規模等で一定数以上のグループにまとめた統計としてのみお示しします。",
  },
  {
    title: "参加者の権利（Participant Rights）",
    body: "ご自身のデータについて、後日その内容の閲覧・訂正・削除をいつでもご請求いただけます。",
  },
  {
    title: "撤回手続き（Withdrawal）",
    body: "ご参加の撤回はいつでも、理由を問わずお申し出いただけます。不利益は一切生じません。",
  },
  {
    title: "データ保護（Data Protection）",
    body: "データは適切に管理された環境で保管し、業務上必要な範囲を超えたアクセスは行いません。",
  },
];

export default function EthicsPage() {
  return (
    <div>
      <PageHero
        eyebrow="RESEARCH ETHICS"
        title="研究倫理"
        lede="JEADは、以下の原則のもとで運営されています。信頼はJEADにとって最も重要な資産です。"
      />

      <Container className="py-14">
        <div className="rounded-sm border border-jead-line bg-white p-6 sm:p-8">
          <h2 className="text-base font-bold text-jead-navy">目的の限定</h2>
          <p className="mt-2 text-sm leading-relaxed text-jead-muted sm:text-base">
            本調査で得られたデータは、学術的・統計的な研究目的にのみ使用します。特定企業への
            営業・勧誘目的では一切使用しません。
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-sm border border-jead-line bg-white p-6"
            >
              <h3 className="text-sm font-bold text-jead-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-jead-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-jead-muted">
          ※ 本調査に関するご質問・ご懸念がございましたら、いつでもお問い合わせページよりご連絡
          ください。
        </p>
      </Container>
    </div>
  );
}

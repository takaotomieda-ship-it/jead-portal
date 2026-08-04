// JEAD Quick Assessment — 設問定義
// 設計根拠: 06_Data_Collection_Framework/JEAD_Core40/02_Quick_Assessment_Design.md
// Core40の短縮版ではなく、自己記入に適した独立の代理指標として設計されたもの。

export type QAOption = { value: string; label: string };

export type QAQuestion = {
  id: string;
  section: "A" | "B" | "C";
  domain?: "STR" | "PPL" | "PRC" | "KNW" | "AIC" | "FUT";
  title: string;
  type: "select" | "text";
  options?: QAOption[];
  placeholder?: string;
  required: boolean;
};

export const INDUSTRIES: QAOption[] = [
  { value: "製造業", label: "製造業" },
  { value: "卸売・貿易業", label: "卸売・貿易業" },
  { value: "物流・運輸業", label: "物流・運輸業" },
  { value: "医療・福祉業", label: "医療・福祉業" },
  { value: "建設業", label: "建設業" },
  { value: "宿泊・飲食業", label: "宿泊・飲食業" },
  { value: "その他サービス業", label: "その他サービス業" },
  { value: "その他", label: "その他" },
];

// ドメイン代理指標の5段階選択肢。value=成熟度レベル(1-5)としてスコアリングに使用する。
function levels(labels: [string, string, string, string, string]): QAOption[] {
  return labels.map((label, i) => ({ value: String(i + 1), label }));
}

export const SECTION_A: QAQuestion[] = [
  {
    id: "industry",
    section: "A",
    title: "貴社の主たる事業分野を教えてください。",
    type: "select",
    required: true,
    options: INDUSTRIES,
  },
  {
    id: "size",
    section: "A",
    title: "貴社の従業員数を教えてください。",
    type: "select",
    required: true,
    options: [
      { value: "〜50人", label: "〜50人" },
      { value: "50〜300人", label: "50〜300人" },
      { value: "300〜1000人", label: "300〜1000人" },
      { value: "1000人以上", label: "1000人以上" },
    ],
  },
  {
    id: "region",
    section: "A",
    title: "貴社の所在地域を教えてください。",
    type: "select",
    required: true,
    options: [
      "北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州・沖縄",
    ].map((r) => ({ value: r, label: r })),
  },
  {
    id: "growth",
    section: "A",
    title: "貴社の直近3年間の売上成長率は、おおよそどの水準ですか。",
    type: "select",
    required: true,
    options: [
      { value: "減少傾向", label: "減少傾向" },
      { value: "横ばい（±5%程度）", label: "横ばい（±5%程度）" },
      { value: "安定成長（5〜15%）", label: "安定成長（5〜15%）" },
      { value: "高成長（15%以上）", label: "高成長（15%以上）" },
    ],
  },
];

export const SECTION_B: QAQuestion[] = [
  {
    id: "str",
    section: "B",
    domain: "STR",
    title:
      "貴社が今後の方向性（次に何に力を入れるか）を、社内でどれくらいはっきり共有できていますか。",
    type: "select",
    required: true,
    options: levels([
      "ほとんど共有されていない",
      "一部の経営層のみ",
      "管理職層まで共有",
      "文書化され活用されている",
      "全社で共有され定期的に見直されている",
    ]),
  },
  {
    id: "ppl",
    section: "B",
    domain: "PPL",
    title: "新しいやり方や仕組みを取り入れるとき、社内でどれくらいスムーズに対応できますか。",
    type: "select",
    required: true,
    options: levels([
      "その都度外部に頼る",
      "一部の人に依存",
      "部署単位で対応可能",
      "計画的に人材育成している",
      "全社的に柔軟に対応できる",
    ]),
  },
  {
    id: "prc",
    section: "B",
    domain: "PRC",
    title:
      "日々の業務のやり方は、どれくらい「誰がやっても同じ」ようにマニュアル化・仕組み化されていますか。",
    type: "select",
    required: true,
    options: levels([
      "個人の経験に依存",
      "一部のみマニュアル化",
      "主要業務は手順化",
      "定期的に見直している",
      "システムに組み込まれている",
    ]),
  },
  {
    id: "knw",
    section: "B",
    domain: "KNW",
    title: "ベテラン社員の知識やノウハウは、どれくらい他の人にも共有されていますか。",
    type: "select",
    required: true,
    options: levels([
      "その人だけが知っている",
      "聞けば教えてもらえる",
      "一部資料化",
      "体系的に文書化",
      "定期更新され教育に活用",
    ]),
  },
  {
    id: "aic",
    section: "B",
    domain: "AIC",
    title: "AIやデータ活用について、貴社は現在どの段階にありますか。",
    type: "select",
    required: true,
    options: levels([
      "検討したことがない",
      "情報収集中",
      "一部試行中",
      "複数業務で活用検証中",
      "全社展開の仕組みがある",
    ]),
  },
  {
    id: "fut",
    section: "B",
    domain: "FUT",
    title: "結果が読めない新しい取り組みに、貴社はどれくらい前向きに投資しますか。",
    type: "select",
    required: true,
    options: levels([
      "確実でなければ投資しない",
      "小規模なら試す",
      "予算枠がある",
      "リスクを織り込んだ基準がある",
      "並行して複数試している",
    ]),
  },
];

export const SECTION_C: QAQuestion[] = [
  {
    id: "pain",
    section: "C",
    title: "貴社の業務の中で、最も時間や手間がかかっていると感じる作業は何ですか。",
    type: "text",
    required: true,
    placeholder: "例：見積書の作成に毎回時間がかかっている",
  },
  {
    id: "aiInterest",
    section: "C",
    title: "AIやデジタル技術を使ってみたいと感じる業務があれば教えてください。",
    type: "text",
    required: false,
    placeholder: "任意回答",
  },
];

export const ALL_QUESTIONS: QAQuestion[] = [...SECTION_A, ...SECTION_B, ...SECTION_C];

export const DOMAIN_LABELS: Record<string, string> = {
  STR: "戦略",
  PPL: "組織",
  PRC: "業務プロセス",
  KNW: "知識管理",
  AIC: "AI活用",
  FUT: "変革準備度",
};

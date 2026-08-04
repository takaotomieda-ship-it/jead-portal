import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import QuickAssessmentWizard from "@/components/QuickAssessmentWizard";

export const metadata: Metadata = {
  title: "簡易調査（Quick Assessment） | JEAD",
  description: "10〜15分で完結する、貴社の経営基盤の簡易自己診断です。",
};

export default function QuickAssessmentPage() {
  return (
    <div>
      <PageHero
        eyebrow="QUICK ASSESSMENT"
        title="簡易調査"
        lede="所要時間10〜15分。回答後すぐに、貴社の経営基盤スナップショットをお返しします。正式な経営者面談（Core40）とは異なる簡易的な自己診断です。"
      />

      <Container className="py-14">
        <QuickAssessmentWizard />
      </Container>
    </div>
  );
}

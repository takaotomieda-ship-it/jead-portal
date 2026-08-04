import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "参加登録 | JEAD",
  description: "JEADへの参加登録フォーム。",
};

export default function RegisterPage() {
  return (
    <div>
      <PageHero
        eyebrow="REGISTRATION"
        title="参加登録"
        lede="以下の項目のみでご登録いただけます。この時点で調査への回答は必要ありません。"
      />

      <Container className="py-14">
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </Container>
    </div>
  );
}

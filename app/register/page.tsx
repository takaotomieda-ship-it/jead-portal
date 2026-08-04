import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "参加登録 | JEAD",
  description: "JEADへの参加登録フォーム。",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialType = params.type === "interview" ? "interview" : "registration";

  return (
    <div>
      <PageHero
        eyebrow="REGISTRATION"
        title="参加登録"
        lede="以下の項目のみでご登録いただけます。この時点で調査への回答は必要ありません。"
      />

      <Container className="py-14">
        <RegisterForm initialType={initialType} />
      </Container>
    </div>
  );
}

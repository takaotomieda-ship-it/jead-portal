import Container from "./Container";

export default function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="border-b border-jead-line bg-white">
      <Container className="py-14 sm:py-16">
        <p className="text-xs font-semibold tracking-widest text-jead-gold">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-2xl font-bold text-jead-navy sm:text-3xl">
          {title}
        </h1>
        {lede && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-jead-muted sm:text-base">
            {lede}
          </p>
        )}
      </Container>
    </section>
  );
}

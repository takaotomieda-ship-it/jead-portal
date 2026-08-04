import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-jead-line bg-white">
      <Container className="flex flex-col gap-4 py-10 text-sm text-jead-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-jead-navy">JEAD</p>
          <p className="mt-1">Japan Enterprise AI Database</p>
          <p className="mt-3 text-xs">
            &copy; {new Date().getFullYear()} JEAD Research Project. All
            rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/about" className="hover:text-jead-navy">
            JEADとは
          </Link>
          <Link href="/participation" className="hover:text-jead-navy">
            研究参加
          </Link>
          <Link href="/ethics" className="hover:text-jead-navy">
            研究倫理
          </Link>
          <Link href="/contact" className="hover:text-jead-navy">
            お問い合わせ
          </Link>
        </nav>
      </Container>
    </footer>
  );
}

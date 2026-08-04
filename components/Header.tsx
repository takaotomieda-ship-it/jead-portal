"use client";

import Link from "next/link";
import { useState } from "react";
import Container from "./Container";

const NAV_LINKS = [
  { href: "/", label: "ホーム" },
  { href: "/about", label: "JEADとは" },
  { href: "/participation", label: "研究参加" },
  { href: "/ethics", label: "研究倫理" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-jead-line bg-jead-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="text-lg font-bold tracking-wide text-jead-navy">
            JEAD
          </span>
          <span className="hidden text-[11px] text-jead-muted sm:block">
            Japan Enterprise AI Database
          </span>
        </Link>

        <nav className="hidden gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-jead-ink transition-colors hover:text-jead-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/register"
          className="hidden rounded-sm bg-jead-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-jead-navy-light md:inline-block"
        >
          研究に参加する
        </Link>

        <button
          type="button"
          aria-label="メニューを開く"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-px w-6 bg-jead-ink transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-jead-ink transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-px w-6 bg-jead-ink transition-transform ${
              open ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
      </Container>

      {open && (
        <div className="border-t border-jead-line bg-jead-paper md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-3 text-[15px] text-jead-ink hover:bg-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-sm bg-jead-navy px-4 py-3 text-center text-[15px] font-medium text-white"
            >
              研究に参加する
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}

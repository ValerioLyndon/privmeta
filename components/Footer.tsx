"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex justify-center w-full border-t border-[var(--border)]">
      <div className="flex justify-between items-center w-full max-w-[var(--max-content-width)] px-[var(--space-md)] h-14">
        <p>
          Built for privacy. The source code is available on{" "}
          <Link className="underline" href="/">
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;

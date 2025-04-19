"use client";

import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./NavMenu";
import { Code } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex justify-center w-full border-b border-[var(--border)] backdrop-blur-lg">
      <nav className="flex justify-between items-center w-full max-w-[var(--max-content-width)] px-[var(--space-md)] h-14">
        <div className="flex gap-[var(--space-2xl)] items-center">
          <Link href="/" passHref>
            <Image
              src="/PrivMetaLogoLightMode.png"
              alt="PrivMeta Logo"
              width={516}
              height={115}
              className="w-24 h-auto cursor-pointer dark:hidden"
            />
            <Image
              src="/PrivMetaLogoDarkMode.png"
              alt="PrivMeta Logo"
              width={516}
              height={115}
              className="hidden dark:inline w-24 h-auto cursor-pointer"
            />
          </Link>

          <NavMenu />
        </div>
        <div className="flex gap-[var(--space-md)]">
          <Button
            variant="ghost"
            size="icon"
            aria-label="View source on GitHub"
            asChild
          >
            <a
              href="https://github.com/DScaife/privmeta/tree/master"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

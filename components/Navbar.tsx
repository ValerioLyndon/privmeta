"use client";

import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./NavMenu";
import { GitBranch } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="flex justify-center w-full border-b border-[var(--border)]">
      <nav className="flex justify-between items-center w-full max-w-[var(--max-content-width)] h-14">
        <div className="flex gap-[var(--space-2xl)] items-center">
          <Image
            src="/PrivMetaLogoLightMode.png"
            alt="PrivMeta Logo"
            width={516}
            height={115}
            className="w-32 h-auto cursor-pointer dark:hidden"
            onClick={() => {}}
          />
          <Image
            src="/PrivMetaLogoDarkMode.png"
            alt="PrivMeta Logo"
            width={516}
            height={115}
            className="hidden dark:inline w-32 h-auto cursor-pointer"
            onClick={() => {}}
          />
          <NavMenu />
        </div>
        <div className="flex gap-[var(--space-md)]">
          <Button variant="ghost" size="icon">
            <GitBranch className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

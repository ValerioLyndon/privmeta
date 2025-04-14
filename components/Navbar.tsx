import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  return (
    <header className="flex justify-center w-full">
      <nav className="w-full max-w-[var(--max-content-width)] h-16">
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Navbar;

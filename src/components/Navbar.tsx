"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  activePage: "directory" | "submit" | "community" | "documentation" | "home" | "about" | "guidelines" | "privacy" | "support";
  isFixed?: boolean;
  showSearch?: "projects" | "submissions" | null;
}

const THEMES = [
  { id: "theme-spruce", name: "Spruce Moss", dot: "bg-[#FC4C02]" },
  { id: "theme-marigold", name: "Kashmir Marigold", dot: "bg-[#FFC107]" },
  { id: "theme-ice", name: "Gulmarg Ice", dot: "bg-[#7E57C2]" },
  { id: "theme-rose", name: "Shalimar Rose", dot: "bg-[#EC407A]" },
  { id: "theme-light", name: "Jasmine White", dot: "bg-[#FFFFFF] border border-outline/40" },
];

export default function Navbar({ activePage, isFixed = false, showSearch = null }: NavbarProps) {
  // Visibly detach header from page edges to create a floating pill layout
  const headerClass = isFixed
    ? "fixed top-4 left-0 w-full z-50 px-4 sm:px-6"
    : "sticky top-4 z-50 w-full px-4 sm:px-6";

  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("theme-spruce");

  // Read theme on mount
  useEffect(() => {
    const theme = localStorage.getItem("jkosi-theme") || "theme-spruce";
    setCurrentTheme(theme);
  }, []);

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    localStorage.setItem("jkosi-theme", themeId);

    const root = document.documentElement;
    // Remove other theme classes
    root.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        root.classList.remove(className);
      }
    });
    root.classList.add(themeId);
    setIsThemeMenuOpen(false);
  };

  return (
    <header className={headerClass}>
      <nav className="flex justify-between items-center w-full max-w-[960px] mx-auto px-6 py-3 rounded-full bg-surface-container/70 backdrop-blur-lg border border-outline/50 shadow-2xl shadow-surface-container-lowest/15">
        <div className="flex items-center gap-md">
          <Link
            href="/"
            className="font-headline-xl text-lg md:text-xl font-black text-primary tracking-tighter uppercase select-none flex items-center gap-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.webp"
              alt="JKOSI Logo"
              className="w-12 h-12 object-contain"
            />
            JKOSI
          </Link>
        </div>

        {/* Premium Uppercase Monospace Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/projects"
            className={`font-mono text-[11px] uppercase tracking-widest transition-colors duration-150 ${
              activePage === "directory"
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Directory
          </Link>
          <Link
            href="/submit"
            className={`font-mono text-[11px] uppercase tracking-widest transition-colors duration-150 ${
              activePage === "submit"
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Submit
          </Link>
          <Link
            href="/about"
            className={`font-mono text-[11px] uppercase tracking-widest transition-colors duration-150 ${
              activePage === "about"
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            About
          </Link>
          <Link
            href="/support"
            className={`font-mono text-[11px] uppercase tracking-widest transition-colors duration-150 ${
              activePage === "support"
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Support
          </Link>
        </div>

        <div className="flex items-center gap-md">
          {showSearch === "projects" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchVal.trim()) {
                  router.push(`/projects?search=${encodeURIComponent(searchVal.trim())}`);
                } else {
                  router.push(`/projects`);
                }
              }}
              className="hidden sm:flex relative items-center"
            >
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-sm">
                search
              </span>
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-surface-container rounded-full border border-outline/30 focus:outline-none focus:ring-1 focus:ring-primary text-[11px] font-mono w-32 lg:w-40 text-on-surface transition-all"
                placeholder="Search..."
                type="text"
              />
            </form>
          )}

          {showSearch === "submissions" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchVal.trim()) {
                  router.push(`/admin/collections/submissions?search=${encodeURIComponent(searchVal.trim())}`);
                }
              }}
              className="hidden sm:flex relative items-center"
            >
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-sm">
                search
              </span>
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-surface-container rounded-full border border-outline/30 focus:outline-none focus:ring-1 focus:ring-primary text-[11px] font-mono w-32 lg:w-40 text-on-surface transition-all"
                placeholder="Search..."
                type="text"
              />
            </form>
          )}

          {/* Theme Palette Switcher Dropdown */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="w-8 h-8 rounded-full border border-outline/40 flex items-center justify-center bg-surface hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary cursor-pointer focus:outline-none"
              title="Switch Theme"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">palette</span>
            </button>

            {isThemeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsThemeMenuOpen(false)}
                ></div>
                <div className="absolute right-0 top-10 w-44 bg-surface-container/95 backdrop-blur-md border border-outline/50 rounded-xl py-2 shadow-2xl z-50">
                  <div className="px-3 py-1.5 border-b border-outline/30 font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/80">
                    Select Colorway
                  </div>
                  <div className="p-1 space-y-0.5">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => changeTheme(t.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                          currentTheme === t.id
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-on-surface-variant hover:bg-surface hover:text-on-surface"
                        }`}
                      >
                        <span>{t.name}</span>
                        <span className={`w-2 h-2 rounded-full ${t.dot}`}></span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <a
            href="https://github.com/JK-OSI/JKOSI"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full border border-outline/40 flex items-center justify-center bg-surface hover:bg-surface-container transition-colors"
            title="GitHub"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.icons8.com/?size=100&id=12599&format=png&color=ffffff"
              alt="GitHub"
              className="w-5 h-5 brightness-0 invert"
            />
          </a>

          <div className="md:hidden flex items-center">
            <span className="material-symbols-outlined text-primary cursor-pointer text-2xl">menu</span>
          </div>
        </div>
      </nav>
    </header>
  );
}

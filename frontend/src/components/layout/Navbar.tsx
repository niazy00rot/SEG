"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Image from "next/image";
import "./navbar.scss";
import ThemeToggle from "../ui/ThemeToggle";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Navbar(): ReactElement {
  const t = useTranslations("navbar");

  const navRef = useRef<HTMLElement | null>(null);
  const previonsScrollY = useRef(0);

  const [navOffset, setNavOffset] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  const [progress, setProgress] = useState(0);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previonsScrollY.current;

      // Scroll progress
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        scrollableHeight > 0 ? (currentScrollY / scrollableHeight) * 100 : 0,
      );

      // Navbar movement
      setNavOffset((currentOffset: number) => {
        const navHeigt = navRef.current?.offsetHeight || 0;

        // Scrolling down
        if (delta > 0) {
          return Math.min(currentOffset + delta, navHeigt);
        }

        // Scrolling up
        if (delta < 0) {
          return Math.max(currentOffset + delta, 0);
        }

        return currentOffset;
      });

      setIsSticky(currentScrollY > 110);
      previonsScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll" style={{ width: `${progress}%` }} />

      <nav
        ref={navRef}
        className={isSticky ? "sticky" : ""}
        style={{ transform: `translateY(-${navOffset}px)` }}
      >
        <div className="container">
          <div className="logo">
            <Link href="/">
              <Image src="/logo.png" alt="SEG" width={50} height={50} />
            </Link>
          </div>
          <div className="linksBox">
            <div
              className={`closeButton ${isMenuOpen ? "toggle" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <div className="links">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={
                  pathname === "/" && activeSection === "home" ? "active" : ""
                }
              >
                {t("links.home")}
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className={pathname === "/products" ? "active" : ""}
              >
                {t("links.products")}
              </Link>
            </div>
            {/* <div className="modes">
              <LanguageSwitcher />
              <ThemeToggle />
            </div> */}
          </div>
        </div>
      </nav>
    </>
  );
}

import type { ReactElement } from "react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Image from "next/image";
import "./navbar.scss";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar(): ReactElement {
  return (
    <>
      <nav>
        <div className="container">
          <div className="logo">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
          </div>

          <div className="links">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}

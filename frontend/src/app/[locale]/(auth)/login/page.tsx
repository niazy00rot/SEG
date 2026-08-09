'use client'
import {useTranslations} from "next-intl";
import { FcGoogle } from "react-icons/fc";

import Link from 'next/link';
import '../auth.scss';

export default function LoginPage() {
  const t = useTranslations("auth.login");
  return (
    <>
      <section className="authentication">
        <div className="background">
test
        </div>
        <div className="container">
          <div className="form"></div>
        </div>
      </section>
    </>
  );
}
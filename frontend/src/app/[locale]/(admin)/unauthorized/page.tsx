"use client";

import { useRouter } from "next/navigation";
import "./unauthorized.scss"

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <section className="unauthorizedPage">
      <div className="container">
        <div className="content">
          <h1>Access Denied</h1>

          <p>
            You are not authorized to access this page.
            Please log in with an authorized account.
          </p>

          <div className="actions">
            <button type="button" onClick={handleBack}>
              Go Back
            </button>

            <button type="button" onClick={handleLogin}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

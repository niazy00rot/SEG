"use client";

import { useState } from "react";
import "./app.scss";

export default function App() {
  const isEnglish =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/en") ||
      window.location.search.includes("lang=en"));

  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      {showPopup && (
        <div className="mobile-app-popup">
          <div className="popup-content">

            <button className="close-btn" onClick={() => setShowPopup(false)}>
              &times;
            </button>

            <p>
              {isEnglish
                ? "For a better experience, use the mobile app."
                : "لتجربة أفضل، استخدم تطبيق الموبايل."}
            </p>

            <a href="app/seg.apk" download>
              {isEnglish ? "Download App" : "تنزيل التطبيق"}
            </a>

          </div>
        </div>
      )}
    </>
  );
}

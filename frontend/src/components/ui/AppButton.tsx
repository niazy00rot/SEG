"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import "./app.scss";

export default function App() {
  const locale = useLocale();
  const isEnglish = locale === "en";

  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      {showPopup && (
        <div className="mobile-app-popup">
          <div className="popup-content">
            <button
              className="close-btn"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>

            <p>
              {isEnglish
                ? "For a better experience, use the mobile app."
                : "لتجربة أفضل، استخدم تطبيق الموبايل."}
            </p>

            <a href="/app/seg.apk" download>
              {isEnglish ? "Download App" : "تنزيل التطبيق"}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
import { useState } from "react";

const langs = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "ir", label: "فارسی", flag: "🇮🇷" },
];

export function LanguageRail() {
  const [active, setActive] = useState("tr");

  return (
    <div className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-40">
      <div className="rounded-full bg-emerald-500 text-white px-3 py-2 text-xs shadow-lg hover:brightness-110 transition">
        WhatsApp
      </div>
      <div className="flex flex-col gap-2 glass rounded-full p-2">
        {langs.map((l) => (
          <button
            key={l.code}
            aria-label={l.label}
            onClick={() => setActive(l.code)}
            className={`h-9 w-9 grid place-items-center rounded-full text-base transition ${
              active === l.code
                ? "bg-brand text-white shadow"
                : "bg-white/70 dark:bg-white/10"
            }`}
          >
            <span role="img" aria-hidden>
              {l.flag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import Link from "next/link";
import { useLang } from "../../context/LangContext";
import { getT } from "../../i18n/translations";

export default function NotAuthWidget() {
  const lang = useLang();
  const t = getT(lang);

  return (
      <div className="text-center border border-white/5 rounded-lg p-10 flex flex-col items-center gap-5">
        <span className="text-2xl">🔒</span>
        <div>
          <p className="text-white text-sm tracking-widest uppercase mb-1">{t.access_refused}</p>
          <p className="text-[#555] text-xs">{t.auth_required}</p>
        </div>
        <Link href={`/auth`}
          className="text-xs px-4 py-2 border border-white/10 text-[#888] hover:text-white hover:border-white/30 transition-all rounded">
          {t.login}
        </Link>
      </div>
  );
}
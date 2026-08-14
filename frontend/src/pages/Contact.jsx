import { useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";

const EMAIL_PRIMARY = "galaxia6440@gmail.com";
const EMAIL_SECONDARY = "galaxia6440@proton.me";
const DISCORD = "luk_cpm";

function CopyRow({ label, value }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };
  return (
    <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      <div>
        <div className="eyebrow">{label}</div>
        <div style={{ fontFamily: "var(--font-mono)", marginTop: 6 }}>{value}</div>
      </div>
      <button className="btn btn--sm btn--ghost" onClick={copy}>
        {copied ? t("contact_copied") : t("contact_copy")}
      </button>
    </div>
  );
}

export default function Contact() {
  const { t } = useLang();

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">{t("nav_contact")}</div>
        <h1 className="h1">{t("contact_title")}</h1>

        <div className="grid grid--2" style={{ marginTop: 44, maxWidth: 760 }}>
          <CopyRow label={t("contact_discord")} value={DISCORD} />
          <CopyRow label={t("contact_email_primary")} value={EMAIL_PRIMARY} />
          <CopyRow label={t("contact_email_secondary")} value={EMAIL_SECONDARY} />
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 40, flexWrap: "wrap" }}>
          <a href={`mailto:${EMAIL_PRIMARY}`} className="btn btn--solid">
            {t("contact_email_primary")}
          </a>
          <a href="https://discord.gg/gyN9pzZcep" target="_blank" rel="noreferrer" className="btn btn--ghost">
            {t("contact_gpr_discord")}
          </a>
        </div>
      </div>
    </div>
  );
}

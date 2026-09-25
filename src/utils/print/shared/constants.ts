const PHONE_NUMBER = "0333-9072225";
const FACEBOOK_HANDLE = "Harrum Cloth House";
const GMAIL_ADDRESS = "Harrumcloth@gmail.com";

const toIntlPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  return digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
};

export const CONTACT_LINKS = {
  phone: `tel:+${toIntlPhone(PHONE_NUMBER)}`,
  whatsapp: `https://wa.me/${toIntlPhone(PHONE_NUMBER)}`,
  facebook: "https://facebook.com/profile.php?id=100071621821943",
  gmail: `mailto:${GMAIL_ADDRESS}`,
};

export const CONTACT_INFO = {
  phone: PHONE_NUMBER,
  facebook: FACEBOOK_HANDLE,
  gmail: GMAIL_ADDRESS,
};

const HANDSET_PATH =
  "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";

export const ICONS = {
  phone: `<svg viewBox="0 0 24 24" width="26" height="26">
    <rect width="24" height="24" rx="5" fill="#4caf50"/>
    <g transform="translate(4 4) scale(0.66)">
      <path d="${HANDSET_PATH}" fill="#fff"/>
    </g>
  </svg>`,

  whatsapp: `<svg viewBox="0 0 24 24" width="26" height="26">
    <rect width="24" height="24" rx="5" fill="#25d366"/>
    <path
      d="M12 4a8 8 0 0 0-6.9 12L4 20l4.1-1.1A8 8 0 1 0 12 4z"
      fill="none"
      stroke="#fff"
      stroke-width="1.6"
      stroke-linejoin="round"
    />
    <g transform="translate(7.3 7.3) scale(0.4)">
      <path d="${HANDSET_PATH}" fill="#fff"/>
    </g>
  </svg>`,

  facebook: `<svg viewBox="0 0 24 24" width="26" height="26">
    <rect width="24" height="24" rx="5" fill="#1877f2"/>
    <path
      d="M13.5 20v-6.5h2.3l.4-2.7h-2.7V9.2c0-.8.3-1.3 1.4-1.3h1.4V5.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.4 1.3-3.4 3.500v1.800H8.500v2.700h2.300V20h2.700z"
      fill="#fff"
    />
  </svg>`,

  gmail: `<svg viewBox="0 0 24 24" width="26" height="26">
    <path
      d="M3 19V7l9 7 9-7v12"
      fill="none"
      stroke="#d93025"
      stroke-width="3.2"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>`,
};

export const LOGO = "/app-logo.png";

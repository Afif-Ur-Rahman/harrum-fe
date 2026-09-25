import { CONTACT_INFO, CONTACT_LINKS, ICONS, STATEMENT_LOGO } from "../constants";

export const Header = (origin: string) => `
  <div class="header">
    <div class="logo">
      <img
        src="${origin}${STATEMENT_LOGO}"
        alt="Harrum Cloth House"
      />
    </div>

    <div class="contacts">
      <a class="contact" href="${CONTACT_LINKS.phone}">
        ${ICONS.phone}
        <span>${CONTACT_INFO.phone}</span>
      </a>

      <a
        class="contact"
        href="${CONTACT_LINKS.whatsapp}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${ICONS.whatsapp}
        <span>${CONTACT_INFO.phone}</span>
      </a>

      <a
        class="contact"
        href="${CONTACT_LINKS.facebook}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${ICONS.facebook}
        <span>${CONTACT_INFO.facebook}</span>
      </a>

      <a class="contact" href="${CONTACT_LINKS.gmail}">
        ${ICONS.gmail}
        <span>${CONTACT_INFO.gmail}</span>
      </a>
    </div>
  </div>
`;

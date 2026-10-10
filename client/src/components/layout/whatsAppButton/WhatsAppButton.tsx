import "./WhatsAppButton.scss";

const WhatsAppButton = () => {
  const phoneNumber = "923177489578";

  const message = encodeURIComponent(
    "Assalam-o-Alaikum! I want to know more about Eshani products.",
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Eshani on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.01 3C8.84 3 3.01 8.82 3.01 15.99c0 2.29.6 4.52 1.75 6.5L3 29l6.68-1.74a13 13 0 0 0 6.32 1.62h.01c7.16 0 13-5.83 13-13S23.18 3 16.01 3Zm0 23.68h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.96 1.04 1.06-3.86-.25-.4a10.67 10.67 0 1 1 9 4.94Zm5.86-8c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.59-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.68s1.16 3.11 1.32 3.32c.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.25 1.47.22 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.76.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;

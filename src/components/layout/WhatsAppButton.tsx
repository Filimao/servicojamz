import { MessageCircle } from "lucide-react";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

export function WhatsAppButton() {
  const { data: settings } = usePlatformSettings();
  const phone = (settings?.contact_phone || "879132543").replace(/\D/g, "");
  const url = `https://wa.me/258${phone}?text=${encodeURIComponent(
    "Olá! Preciso de ajuda no ServiçoJá."
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-secondary text-secondary-foreground shadow-glow-lg flex items-center justify-center hover:scale-110 transition-transform animate-wa-pulse"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}

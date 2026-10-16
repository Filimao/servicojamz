import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Handshake } from "lucide-react";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

export function Footer() {
  const { data: settings } = usePlatformSettings();
  const platformName = settings?.platform_name || "ServiçoJá";
  const logoUrl = settings?.logo_url;
  const description = settings?.platform_description || "Conectando Moçambicanos a profissionais de confiança. Encontre o serviço que precisa, perto de si.";
  const contactPhone = settings?.contact_phone || "879132543";
  const supportEmail = settings?.support_email || "filimaofelix10@gmail.com";
  const location = settings?.location || "Moçambique";
  const phoneDigits = contactPhone.replace(/\D/g, "");

  return (
    <footer className="bg-foreground text-background py-10 sm:py-12 mt-20 pb-20 md:pb-12">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={platformName} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-primary-foreground" />
                </div>
              )}
              <span className="font-bold text-xl">{platformName}</span>
            </div>
            <p className="text-background/70 mb-4">
              {description}
            </p>
            <p className="text-background/50 text-sm italic">
              A plataforma apenas conecta clientes e profissionais. O pagamento e o acordo são feitos diretamente entre as partes.
            </p>
          </div>

          {/* Para Clientes */}
          <div>
            <h4 className="font-semibold mb-4">Para Clientes</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-background/70 hover:text-background transition-colors">
                  Encontrar Serviços
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-background/70 hover:text-background transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-background/70 hover:text-background transition-colors">
                  Criar Conta
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Profissionais */}
          <div>
            <h4 className="font-semibold mb-4">Para Profissionais</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/para-profissionais" className="text-background/70 hover:text-background transition-colors">
                  Cadastrar-se
                </Link>
              </li>
              <li>
                <Link to="/para-profissionais#planos" className="text-background/70 hover:text-background transition-colors">
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link to="/para-profissionais#beneficios" className="text-background/70 hover:text-background transition-colors">
                  Benefícios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`tel:+258${phoneDigits}`}
                  className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>+258 {contactPhone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/258${phoneDigits}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {contactPhone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${supportEmail}`}
                  className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{supportEmail}</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-background/70">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-xs text-background/50">
          Foto de capa: <a href="https://commons.wikimedia.org/wiki/File:Wiki_Loves_Africa._Light_technician_at_work.jpg" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">Vision2divinity / Wikimedia Commons</a>
          {" · "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-background">CC BY-SA 4.0</a>
          {" · imagem reenquadrada"}
        </p>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">
              © {new Date().getFullYear()} {platformName}. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/termos-de-uso" className="text-background/70 hover:text-background transition-colors">
                Termos de Uso
              </Link>
              <Link to="/politica-de-privacidade" className="text-background/70 hover:text-background transition-colors">
                Política de Privacidade
              </Link>
              <a 
                href="https://wa.me/258879132543" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-background/70 hover:text-background transition-colors"
              >
                Suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
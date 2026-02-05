import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-20">
      <div className="container-app">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl">🤝</span>
              </div>
              <span className="font-bold text-xl">ServiçoJá</span>
            </div>
            <p className="text-background/70 mb-4 max-w-sm">
              Conectando Moçambicanos a profissionais de confiança. 
              Encontre o serviço que precisa, perto de si.
            </p>
            <p className="text-background/50 text-sm">
              © 2024 ServiçoJá. Todos os direitos reservados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Para Clientes</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-background/70 hover:text-background transition-colors">
                  Encontrar Serviços
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-background/70 hover:text-background transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-background/70 hover:text-background transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Para Profissionais</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/providers" className="text-background/70 hover:text-background transition-colors">
                  Cadastrar-se
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-background/70 hover:text-background transition-colors">
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-background/70 hover:text-background transition-colors">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

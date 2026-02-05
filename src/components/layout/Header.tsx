import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <span className="text-xl">🤝</span>
            </div>
            <span className="font-bold text-xl text-foreground">ServiçoJá</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/services" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Serviços
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Como Funciona
            </Link>
            <Link 
              to="/providers" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Para Profissionais
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" size="sm">
              Entrar
            </Button>
            <Button variant="hero" size="sm">
              Cadastrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/services" 
                className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Como Funciona
              </Link>
              <Link 
                to="/providers" 
                className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Para Profissionais
              </Link>
              <div className="flex gap-2 px-4 pt-4 mt-2 border-t border-border">
                <Button variant="outline" className="flex-1">
                  Entrar
                </Button>
                <Button variant="hero" className="flex-1">
                  Cadastrar
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

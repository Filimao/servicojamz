import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Search, LogOut, Shield, Briefcase, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();
  const { data: settings } = usePlatformSettings();
  const navigate = useNavigate();
  const isProvider = profile?.user_type === "provider";
  const platformName = settings?.platform_name || "ServiçoJá";
  const logoUrl = settings?.logo_url;

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={platformName} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <span className="text-xl">🤝</span>
              </div>
            )}
            <span className="font-bold text-xl text-foreground">{platformName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Serviços</Link>
            <Link to="/como-funciona" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Como Funciona</Link>
            <Link to="/para-profissionais" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Para Profissionais</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/services">
              <Button variant="ghost" size="sm"><Search className="w-4 h-4 mr-2" />Buscar</Button>
            </Link>
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    {isProvider && (
                      <Link to="/painel">
                        <Button variant="ghost" size="sm"><Briefcase className="w-4 h-4 mr-1" />Painel</Button>
                      </Link>
                    )}
                    <Link to="/meus-pedidos">
                      <Button variant="ghost" size="sm"><FileText className="w-4 h-4 mr-1" />Pedidos</Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin">
                        <Button variant="outline" size="sm"><Shield className="w-4 h-4 mr-1" />Admin</Button>
                      </Link>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {profile?.full_name?.split(" ")[0] || "Usuário"}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut className="w-4 h-4" /></Button>
                  </div>
                ) : (
                  <>
                    <Link to="/auth"><Button variant="outline" size="sm">Entrar</Button></Link>
                    <Link to="/auth"><Button variant="hero" size="sm">Cadastrar</Button></Link>
                  </>
                )}
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link to="/services" className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Serviços</Link>
              <Link to="/como-funciona" className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Como Funciona</Link>
              <Link to="/para-profissionais" className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Para Profissionais</Link>
              {user && (
                <>
                  <Link to="/meus-pedidos" className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Meus Pedidos</Link>
                  {isProvider && (
                    <Link to="/painel" className="px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Painel Profissional</Link>
                  )}
                </>
              )}
              <div className="flex flex-col gap-2 px-4 pt-4 mt-2 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{profile?.full_name || "Usuário"}</span>
                      </div>
                      <NotificationBell />
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full mb-2"><Shield className="w-4 h-4 mr-2" />Painel Admin</Button>
                      </Link>
                    )}
                    <Button variant="outline" className="w-full" onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" />Sair</Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/auth" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Entrar</Button>
                    </Link>
                    <Link to="/auth" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" className="w-full">Cadastrar</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

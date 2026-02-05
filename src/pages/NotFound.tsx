import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground mb-8">
          A página que procura não existe ou foi movida.
        </p>
        <Link to="/">
          <Button variant="hero" size="lg">
            <Home className="w-5 h-5" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

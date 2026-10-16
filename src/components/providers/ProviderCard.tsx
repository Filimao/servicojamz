import { ServiceProvider } from "@/types";
import { Star, MapPin, Phone, CheckCircle, BadgeCheck, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
interface ProviderCardProps {
  provider: ServiceProvider;
}
export function ProviderCard({
  provider
}: ProviderCardProps) {
  return <div className="card-interactive p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative">
          
          {provider.isVerified && <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-secondary-foreground" />
            </div>}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate">
              {provider.name}
            </h3>
            {provider.isPremium && <span className="badge-premium">
                <BadgeCheck className="w-3 h-3" />
                Premium
              </span>}
          </div>
          
          <p className="text-sm text-primary font-medium mt-0.5">
            {provider.category}
          </p>
          
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="font-semibold text-foreground">{provider.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({provider.reviewCount} avaliações)
            </span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <span>{provider.location}, {provider.city}</span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
        {provider.description}
      </p>

      {/* Services Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {provider.services.slice(0, 3).map(service => <span key={service} className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground">
            {service}
          </span>)}
        {provider.services.length > 3 && <span className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground">
            +{provider.services.length - 3}
          </span>}
      </div>

      {/* Price Range */}
      <div className="text-sm font-medium text-foreground mb-4">
        <DollarSign className="inline w-4 h-4 mr-1" />{provider.priceRange}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button variant="outline" className="flex-1">
          Ver Perfil
        </Button>
        <Button variant="hero" className="flex-1">
          <Phone className="w-4 h-4" />
          Contactar
        </Button>
      </div>
    </div>;
}
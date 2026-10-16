import { Link } from "react-router-dom";
import { ProviderWithProfile } from "@/hooks/useProviders";
import { Star, MapPin, Phone, CheckCircle, BadgeCheck, MessageCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/CategoryIcon";

interface ProviderCardDBProps {
  provider: ProviderWithProfile;
}

export function ProviderCardDB({ provider }: ProviderCardDBProps) {
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.profile?.full_name || "P")}&background=random&size=150`;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = provider.profile?.phone;
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/258${cleanPhone}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <Link to={`/profissional/${provider.id}`} className="block h-full">
      <div className="card-interactive p-4 sm:p-5 h-full flex flex-col hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={provider.profile?.avatar_url || defaultAvatar}
              alt={provider.profile?.full_name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            {provider.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">
                {provider.profile?.full_name}
              </h3>
              {provider.is_premium && (
                <span className="badge-premium">
                  <BadgeCheck className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            
            <p className="text-sm text-primary font-medium mt-0.5">
              <CategoryIcon icon={provider.category?.icon} className="inline w-4 h-4 mr-1" />{provider.category?.name}
            </p>
            
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-semibold text-foreground">{provider.rating || "0.0"}</span>
              <span className="text-sm text-muted-foreground">
                ({provider.review_count || 0} avaliações)
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        {(provider.profile?.neighborhood || provider.profile?.city) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>
              {provider.profile?.neighborhood}
              {provider.profile?.neighborhood && provider.profile?.city && ", "}
              {provider.profile?.city}
            </span>
          </div>
        )}

        {/* Description */}
        {provider.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
            {provider.description}
          </p>
        )}

        {/* Services Tags */}
        {provider.services && provider.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {provider.services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground"
              >
                {service}
              </span>
            ))}
            {provider.services.length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground">
                +{provider.services.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price Range */}
        {provider.price_range && (
          <div className="text-sm font-medium text-foreground mb-4">
            <DollarSign className="inline w-4 h-4 mr-1" />{provider.price_range}
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 text-xs text-muted-foreground mb-4">
          {provider.years_experience > 0 && (
            <span>{provider.years_experience} anos de exp.</span>
          )}
          {provider.completed_jobs > 0 && (
            <span>{provider.completed_jobs} trabalhos</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button variant="outline" className="flex-1 min-h-[44px]">
            Ver Perfil
          </Button>
          <Button variant="hero" className="flex-1 min-h-[44px]" onClick={handleWhatsApp}>
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
        </div>
      </div>
    </Link>
  );
}

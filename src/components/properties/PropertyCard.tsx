import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Map, Bed, Bath, Square, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/lib/data';
import { formatPrice, formatArea } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const PropertyCard = ({ property, isFavorite , onToggleFavorite }: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
 
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleFavorite) {
      onToggleFavorite(property._id);
    }
  };

  return (
   
    <Link to={`/property/${property._id}`}>
      <Card 
        className="property-card overflow-hidden h-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className="capitalize bg-teal-600">
              {property.status === 'sale' ? 'For Sale' : 'For Rent'}
            </Badge>
            <Badge variant="outline" className="capitalize bg-orange-600 text-white">
              {property.type}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 bg-white/80 hover:bg-white" 
            onClick={handleToggleFavorite}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white font-semibold text-xl">{formatPrice(property.price)}</p>
          </div>
        </div>
        <CardContent className="pt-4">
          <h3 className="font-heading font-semibold text-lg truncate">{property.title}</h3>
          <div className="flex items-center text-muted-foreground mt-1">
            <Map size={14} className="mr-1" />
            <span className="text-sm">{property.location.area}, {property.location.city}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{property.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-muted-foreground">
            {property.features.bedrooms > 0 && (
              <div className="flex items-center mr-3">
                <Bed size={16} className="mr-1" />
                <span className="text-xs">{property.features.bedrooms}</span>
              </div>
            )}
            {property.features.bathrooms > 0 && (
              <div className="flex items-center mr-3">
                <Bath size={16} className="mr-1" />
                <span className="text-xs">{property.features.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center">
              <Square size={16} className="mr-1" />
              <span className="text-xs">{formatArea(property.features.area)}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/property/${property.id}#contact`;
            }}
          >
            <MessageSquare size={14} className="mr-1" />
            <span className="text-xs">Contact</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;

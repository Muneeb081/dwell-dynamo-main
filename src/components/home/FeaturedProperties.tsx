
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProperty, Property } from '@/lib/data';
import PropertyCard from '@/components/properties/PropertyCard'
import { useAuth } from '@/contexts/AuthContext';
import { handleGoogleCallback } from '@/lib/googleAuth';
;

const FeaturedProperties = () => {
  const { user, isPropertyFavorite,addToFavorites, removeFromFavorites } = useAuth();


  const [featuredProperties, setfeaturedProperties] = useState<Property[]>([]);
  // For demo purposes, just show the first 4 properties
  useEffect(() => {
  const fetchData = async () => {
    const featuredProperties = await getProperty();
   setfeaturedProperties(featuredProperties.slice(0,4))
  };
  fetchData();
}, []);
 const toggleFavorite = async (propertyId: string) => {
  if (!user) return;

  try {
    const isFavorite = await isPropertyFavorite(propertyId);

    if (isFavorite) {
      await removeFromFavorites(propertyId);
    } else {
      await addToFavorites(propertyId);
    }
  } catch (error) {
    console.error("Error toggling favorite status:", error);
  }
};

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold">Featured Properties</h2>
            <p className="text-muted-foreground mt-2">
              Explore our handpicked selection of premium properties in Islamabad
            </p>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="hidden sm:flex items-center">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map(property => (
            <PropertyCard
              key={property._id}
              property={property}
              isFavorite={user?.favorites.includes(property._id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/properties">
            <Button variant="outline" className="w-full">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

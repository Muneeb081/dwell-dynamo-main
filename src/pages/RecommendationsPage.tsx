
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getRecommendedProperties } from '@/lib/data';
import PropertyCard from '@/components/properties/PropertyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, PlusCircle, SearchIcon } from 'lucide-react';

const RecommendationsPage = () => {
  const { user, isPropertyFavorite, addToFavorites, removeFromFavorites } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/recommendations' } });
      return;
    }
    
    loadRecommendations();
  }, [user, navigate]);
  
  const loadRecommendations = async () => {
    setLoading(true);
    try {
      if (user) {
        const recommendedProperties =await getRecommendedProperties(user.id);
        setRecommendations(recommendedProperties);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleFavorite = (id:any) => {
    if (isPropertyFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };
  
  const filteredRecommendations = searchTerm
    ? recommendations.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        property.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : recommendations;
  
  if (!user) {
    return (
      <MainLayout>
        <div className="bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center">Please log in to view your recommendations</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold">AI Recommendations</h1>
              <p className="text-muted-foreground mt-1">
                Properties recommended based on your preferences and browsing history
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="relative w-64">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search recommendations..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => navigate('/properties')}>
                View All Properties
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">Loading recommendations...</div>
          ) : recommendations.length === 0 ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>No recommendations yet</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">We're learning your preferences</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Save properties to your favorites or browse more listings to get personalized recommendations
                </p>
                <Button className="mt-8" onClick={() => navigate('/properties')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Browse Properties
                </Button>
              </CardContent>
            </Card>
          ) : filteredRecommendations.length === 0 ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>No matches found</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  No properties match your search term. Try a different keyword.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={isPropertyFavorite(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RecommendationsPage;

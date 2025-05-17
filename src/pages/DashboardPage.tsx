
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building, 
  Heart, 
  MessageSquare, 
  Clock, 
  Search, 
  LogOut,
  Plus,
  User
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import MyProperties from '@/components/dashboard/MyProperties';
import { getPropertyById, getUserProperties, Property ,getUnreadMessagesCount} from '@/lib/data';
import PropertyCard from '@/components/properties/PropertyCard';

const DashboardPage = () => {
  const { user, logout, isPropertyFavorite,addToFavorites, removeFromFavorites } = useAuth();
  const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [userProperties,setUserProperties] = useState<Number>(0)
  let id;
user?id=user?.id:id = null;
useEffect(() => {
  const fetchFavorites = async () => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/dashboard' } });
      return;
    }

    try {
      const favoriteProperties = await Promise.all(
        user.favorites.map(id => getPropertyById(id))
      );

      // Filter out undefined/null
      const validFavorites = favoriteProperties.filter(
        (property): property is Property => property !== undefined
      );

      setFavoriteProperties(validFavorites);
    } catch (error) {
      console.error("Failed to load favorite properties:", error);
    }
  };
 const fetchData = async () => {
    if (id !== null) {
      try {
        const res = await getUserProperties(id);
        setUserProperties(res.length);
      } catch (error) {
        console.error("Failed to fetch user properties:", error);
      }
    }
  };
  fetchData();
  fetchFavorites();
}, [user, navigate]);

   useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const count = await getUnreadMessagesCount(user?.id);
          setUnreadCount(count);
        
        } catch (error) {
          console.error("Error fetching unread message count:", error);
          setUnreadCount(0);  // Set to 0 if there is an error
        }
      }
    };

    if (user) {
      fetchUnreadCount();
    }
  }, [user,navigate]);
 
  const handleToggleFavorite = (propertyId: string) => {
    removeFromFavorites(propertyId);
    setFavoriteProperties(prev => prev.filter(p => p.id !== propertyId));
  };
  
  if (!user) {
    return (
      <MainLayout>
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>Please log in to view your dashboard</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button asChild>
                <Link to="/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Properties</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userProperties}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active property listings
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.favorites.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Properties in your favorites list
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unreadCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Unread messages in your inbox
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.searchHistory.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Recent searches and actions
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="properties">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="mt-6">
              <MyProperties />
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-6">
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-6">Saved Properties</h2>
                
                {favoriteProperties.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Saved Properties</h3>
                    <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                      You haven't saved any properties yet. Browse listings and click the heart icon to save properties here.
                    </p>
                    <Button className="mt-6" asChild>
                      <Link to="/properties">
                        <Search className="h-4 w-4 mr-2" />
                        Browse Properties
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProperties.map(property => (
                    
                      <PropertyCard 
                        key={property._id} 
                        property={property} 
                        isFavorite={isPropertyFavorite(property._id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full p-3">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Recent Search History</h3>
                    {user.searchHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No recent searches</p>
                    ) : (
                      <div className="space-y-2">
                        {user.searchHistory.slice(0, 5).map((search, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm">{search.query}</span>
                            </div>
                            <Badge variant="outline">
                              {formatDate(search.timestamp)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;

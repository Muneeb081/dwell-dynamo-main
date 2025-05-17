import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  Share, 
  Heart, 
  ChevronLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Check, 
  Calendar,
  CalculatorIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Property, getPropertyById, getPropertiesByType, getRecommendedProperties } from '@/lib/data';
import { formatPrice, formatDate, formatArea } from '@/lib/utils';
import PropertyCard from '@/components/properties/PropertyCard';
import ContactForm from '@/components/messaging/ContactForm';
import IslamabadMap from '@/components/properties/IslamabadMap';
import QRCodeDisplay from '@/components/property/qrcode';

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, addToFavorites, removeFromFavorites, isPropertyFavorite } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const isFavorite = user ? isPropertyFavorite(property?.id || '') : false;

  const toggleFavorite = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save properties to your favorites.",
        variant: "destructive"
      });
      return;
    }
    
    if (!property) return;
    
    if (isFavorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProperty = async () => {
    if (id) {
      let propertyData = await getPropertyById(id);
    
      if (propertyData) {
        setProperty(propertyData);
        
        const recommended = user 
          ? getRecommendedProperties(user.id)
          : await getPropertiesByType(propertyData.type, propertyData.status,0,99999999);
        setSimilarProperties(recommended.filter(p => p.id !== id).slice(0, 3));
      } else {
        toast({
          title: 'Property Not Found',
          description: 'The property you are looking for does not exist.',
          variant: 'destructive',
        });
      }
    }// convert undefined to null if needed
  };
   loadProperty();

    // Check if URL has #contact hash
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        contactSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [id, user, toast]);
  
  if (!property) {
    
    return (
      <MainLayout>
        <div className="bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center py-16">Property not found</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <Link to="/properties" className="inline-flex items-center text-muted-foreground hover:text-primary transition">
                <ChevronLeft size={16} className="mr-1" />
                Back to listings
              </Link>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Button variant="outline" size="sm" onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                toast({
                  title: "Link Copied",
                  description: "Property link copied to clipboard",
                });
              }}>
                <Share size={16} className="mr-2" />
                Share
              </Button>
              <Button 
                variant={isFavorite ? "default" : "outline"} 
                size="sm"
                onClick={toggleFavorite}
              >
                <Heart 
                  size={16} 
                  className={`mr-2 ${isFavorite ? 'fill-white' : ''}`} 
                />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
          
          <h1 className="text-3xl font-heading font-bold mb-2">{property.title}</h1>
          <div className="flex items-center text-muted-foreground mb-8">
            <MapPin size={16} className="mr-1" />
            <span>{property.location.address}</span>
          </div>
          
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video overflow-hidden rounded-xl">
                      <img 
                        src={image} 
                        alt={`${property.title} - Image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 right-4">
                        <Badge variant="outline" className="bg-black/60 text-white border-0">
                          {index + 1} / {property.images.length}
                        </Badge>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            <div className="grid grid-cols-5 gap-2 mt-2">
              {property.images.map((image, index) => (
                <div 
                  key={index}
                  className={`aspect-video rounded-md overflow-hidden cursor-pointer border-2 ${
                    activeImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                  <p className="text-muted-foreground text-sm">Price</p>
                  <p className="text-xl font-semibold mt-1">{formatPrice(property.price)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {property.status === 'rent' ? 'per month' : 'one-time'}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                  <p className="text-muted-foreground text-sm">Type</p>
                  <p className="text-xl font-semibold mt-1 capitalize">{property.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                  <p className="text-muted-foreground text-sm">Area</p>
                  <p className="text-xl font-semibold mt-1">{formatArea(property.features.area)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Square Feet</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                  <p className="text-muted-foreground text-sm">Posted</p>
                  <p className="text-lg font-semibold mt-1">{formatDate(property.createdAt)}</p>
                  <p className="text-xs text-muted-foreground mt-1">By {property.createdBy.name}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-heading font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-heading font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                  {property.features.bedrooms > 0 && (
                    <div className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <span>{property.features.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  
                  {property.features.bathrooms > 0 && (
                    <div className="flex items-center space-x-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <span>{property.features.bathrooms} Bathrooms</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Square className="h-5 w-5 text-primary" />
                    <span>{formatArea(property.features.area)} Area</span>
                  </div>
                  
                  {property.features.furnished && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>Furnished</span>
                    </div>
                  )}
                  
                  {property.features.parking && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>Parking Available</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <Tabs defaultValue="location">
                  <TabsList className="w-full border-b rounded-none">
                    <TabsTrigger value="location" className="flex-1">Location</TabsTrigger>
                    <TabsTrigger value="floor-plan" className="flex-1">Floor Plan</TabsTrigger>
                    <TabsTrigger value="street-view" className="flex-1">Street View</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="location" className="p-0">
                    <IslamabadMap 
                      address={`${property.location.address}, ${property.location.area}, ${property.location.city}`}
                      coordinates={property.location.coordinates || { lat: 33.6844, lng: 73.0479 }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">Address:</h3>
                      <p className="text-muted-foreground">
                        {property.location.address}, {property.location.area}, {property.location.city}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="floor-plan" className="p-6 text-center">
                    <div className="py-8">
                      <p className="text-muted-foreground">Floor plan not available for this property.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="street-view" className="p-6 text-center">
                    <div className="py-8">
                      <p className="text-muted-foreground">Street view not available for this property.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card ref={contactSectionRef}>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold mb-4">Contact Agent</h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={property.createdBy.image} alt={property.createdBy.name} />
                     
                    </Avatar>
                    <div>
                      <p className="font-semibold">{property.createdBy.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <Mail size={14} className="mr-1" />
                          <span>{property.createdBy.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <ContactForm 
                      receiverId={property.createdBy._id}
                      receiverName={property.createdBy.name}
                      propertyId={property._id}
                      propertyTitle={property.title}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-semibold mb-4">Mortgage Calculator</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Property Price</span>
                      <span className="font-medium">{formatPrice(property.price)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Down Payment (20%)</span>
                      <span className="font-medium">{formatPrice(property.price * 0.2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Loan Amount</span>
                      <span className="font-medium">{formatPrice(property.price * 0.8)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Est. Monthly Payment</span>
                      <span className="font-medium text-primary">{formatPrice((property.price * 0.8) / 240)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <Link to="/calculator">
                      <Button variant="outline" className="w-full">
                        <CalculatorIcon className="mr-2 h-4 w-4" />
                        Estimate Construction Cost
                      </Button>
                    </Link>
                    {property.type === 'plot' && (
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Planning to build? Use our calculator to estimate construction costs.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {similarProperties.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-heading font-semibold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProperties.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    isFavorite={user ? isPropertyFavorite(property.id) : false}
                    onToggleFavorite={
                      user 
                        ? (id) => isPropertyFavorite(id) 
                          ? removeFromFavorites(id) 
                          : addToFavorites(id)
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetailPage;

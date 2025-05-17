
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getUserProperties, deleteProperty } from '@/lib/data';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  Building, Edit, Eye, Plus, Trash2, AlertTriangle, 
  CheckCircle2, Timer, MessageSquare 
} from 'lucide-react';
import { Property } from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const MyProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProperties();
  }, [user]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      if (user) {
        const userProperties = await getUserProperties(user.id);
        setProperties(userProperties);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    
    try {
    const res=  await deleteProperty(propertyToDelete);
      
if(res.success){
      toast({
        title: "Property Deleted",
        description: "Your property has been successfully deleted",
      });
    }else{
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive"
      });
    }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive"
      });
    } finally {
      setShowDeleteDialog(false);
      setPropertyToDelete(null);
      window.location.reload();
    }
  };

  const renderPropertyCard = (property: Property) => (
    <Card key={property._id} className="h-full flex flex-col">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={`capitalize ${property.status === 'sale' ? 'bg-teal-600' : 'bg-purple-600'}`}>
            {property.status === 'sale' ? 'For Sale' : 'For Rent'}
          </Badge>
          <Badge variant="outline" className="capitalize bg-orange-600 text-white">
            {property.type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-heading font-semibold text-lg truncate">{property.title}</h3>
        <p className="text-primary font-medium mt-1">{formatPrice(property.price)}</p>
        <p className="text-sm text-muted-foreground mt-2 truncate">{property.location.address}</p>
        <div className="flex items-center text-sm text-muted-foreground mt-3">
          <Timer className="h-4 w-4 mr-1" />
          <span>Listed on {formatDate(property.createdAt)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/property/${property._id}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/edit-property/${property._id}`}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/messages')}>
          <MessageSquare className="h-4 w-4 mr-1" />
          Messages
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => handleDeleteClick(property._id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-semibold">My Properties</h2>
        <Button asChild>
          <Link to="/add-property">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="sale">For Sale</TabsTrigger>
          <TabsTrigger value="rent">For Rent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="text-center p-12">Loading your properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Building className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Properties Listed</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                You haven't listed any properties yet. Create your first property listing to get started.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(renderPropertyCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sale" className="mt-6">
          {loading ? (
            <div className="text-center p-12">Loading properties for sale...</div>
          ) : properties.filter(p => p.status === 'sale').length === 0 ? (
            <div className="text-center py-12 px-4">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Properties For Sale</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                You haven't listed any properties for sale. Add a property listing to get started.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property For Sale
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties
                .filter(p => p.status === 'sale')
                .map(renderPropertyCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rent" className="mt-6">
          {loading ? (
            <div className="text-center p-12">Loading rental properties...</div>
          ) : properties.filter(p => p.status === 'rent').length === 0 ? (
            <div className="text-center py-12 px-4">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Rental Properties</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                You haven't listed any properties for rent. Add a rental property listing to get started.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rental Property
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties
                .filter(p => p.status === 'rent')
                .map(renderPropertyCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProperties;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { addProperty } from '@/lib/data';
import LocationPicker from './LocationPicker';
import  {uploadImageToCloudinary}  from '@/lib/Cloudinary.ts';




const propertyFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  type: z.enum(['house', 'apartment', 'commercial', 'plot']),
  status: z.enum(['sale', 'rent']),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  propertyArea: z.coerce.number().positive({ message: 'Area must be a positive number' }),
  furnished: z.boolean().default(false),
  parking: z.boolean().default(false),
    location: z.object({
    city: z.string().min(2, { message: 'City is required' }),
    area: z.string().min(2, { message: 'Area is required' }),
    address: z.string().min(5, { message: 'Address is required' }),
  }),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const AddPropertyForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [location, setLocation] = useState<{
    address: string;
    city: string;
    area: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      type: 'house',
      status: 'sale',
      bedrooms: 0,
      bathrooms: 0,
      propertyArea: 0,
      furnished: false,
      parking: false,
    },
  });

  const handleLocationChange = (newLocation: {
    address: string;
    city: string;
    area: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setLocation(newLocation);
  };
//uplaoding image to Cloudinary and storing url in database
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const newFiles = Array.from(e.target.files);

    if (images.length + newFiles.length > 5) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: "You can upload maximum 5 images",
      });
      return;
    }

    const uploadedUrls: string[] = [];
    const uploadedFiles: File[] = [];

    for (const file of newFiles) {
      const uploadedUrl = await uploadImageToCloudinary(file);

      if (uploadedUrl) {
        uploadedUrls.push(uploadedUrl);
        uploadedFiles.push(file);
      }
    }

    // Update the state with uploaded files and URLs
    setImages(prev => [...prev, ...uploadedFiles]);
    setImageUrls(prev => [...prev, ...uploadedUrls]);
  }
};




  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImageUrls = [...imageUrls];
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

  const onSubmit = async (data: PropertyFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "You need to be logged in to add properties",
      });
      navigate('/login');
      return;
    }

    if (imageUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "No images",
        description: "Please upload at least one image of your property",
      });
      return;
    }

    try {
      // Prepare the property data
      const propertyData = {
        title: data.title,
        description: data.description,
        price: data.price,
        location: {
          city: data.location.city,
          area: data.location.area,
          address: data.location.address,
        },
        features: {
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.propertyArea,
          furnished: data.furnished,
          parking: data.parking,
        },
        images: imageUrls,
        type: data.type,
        status: data.status,
        createdBy: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
        }
      };

      const result = await addProperty(propertyData);
     
      if (result.success) {
        toast({
          title: "Property Added",
          description: "Your property has been successfully listed",
        });
       navigate(`/property/${result.propertyId}`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to add property",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6 md:col-span-2">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Luxury Villa in F-7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your property in detail..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Property Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (PKR)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Location</h3>
            
            <FormField
              control={form.control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Islamabad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location.area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area/Sector</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., F-7, Bahria Town" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complete Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Street 7, F-7/3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Features</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="propertyArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (sq. ft.)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="furnished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Furnished</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Parking Available</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold">Upload Images</h3>
            <p className="text-muted-foreground text-sm">Upload up to 5 high-quality images of your property. The first image will be used as the main image.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {imageUrls.map((url, index) => (
                <Card key={index} className="overflow-hidden relative group">
                  <img 
                    src={url} 
                    alt={`Property image ${index + 1}`} 
                    className="w-full h-32 object-cover"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={() => removeImage(index)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
              
              {imageUrls.length < 5 && (
                <Card className="border-dashed flex items-center justify-center h-32">
                  <CardContent className="p-0 h-full w-full">
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground mt-2">Upload Image</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        multiple={true}
                      />
                    </label>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Property Listing
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPropertyForm;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tag, Home, Building, Store, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const PropertySearch = ({ className = '' }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    status: 'sale',
    location: '',
    type: 'all',
    minPrice: '',
    maxPrice: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchParams.status) params.append('status', searchParams.status);
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.type && searchParams.type !== 'all') params.append('type', searchParams.type);
    if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
    
    navigate(`/properties?${params.toString()}`);
  };

  const handleChange = (field: keyof typeof searchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`${className} w-full`}>
      <Tabs defaultValue="sale" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger 
            value="sale" 
            onClick={() => handleChange('status', 'sale')}
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger 
            value="rent" 
            onClick={() => handleChange('status', 'rent')}
            className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
          >
            Rent
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sale" className="mt-0">
          <form onSubmit={handleSearch} className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="location"
                    placeholder="Islamabad"
                    className="pl-10"
                    value={searchParams.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Property Type</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Select 
                    value={searchParams.type} 
                    onValueChange={(value) => handleChange('type', value)}

                  >
                    <SelectTrigger id="type" className="pl-10 text-foreground">
                      <SelectValue placeholder="All Types"  />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">Houses</SelectItem>
                      <SelectItem value="apartment">Apartments</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="plot">Plots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">Price Range</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <div className="grid grid-cols-2 gap-2 text-foreground">
                    <Input
                      id="minPrice"
                      placeholder="Min Price"
                      className="pl-10 "
                      value={searchParams.minPrice}
                      onChange={(e) => handleChange('minPrice', e.target.value)}
                    />
                    <Input
                      id="maxPrice"
                      placeholder="Max Price"
                      value={searchParams.maxPrice}
                      onChange={(e) => handleChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Search className="mr-2 h-5 w-5" />
              Search Properties
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="rent" className="mt-0">
          <form onSubmit={handleSearch} className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="location"
                    placeholder="Islamabad"
                    className="pl-10"
                    value={searchParams.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">Property Type</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Select 
                    value={searchParams.type} 
                    onValueChange={(value) => handleChange('type', value)}
                  >
                    <SelectTrigger id="type" className="pl-10 text-foreground">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">Houses</SelectItem>
                      <SelectItem value="apartment">Apartments</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">Monthly Rent</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      id="minPrice"
                      placeholder="Min Rent"
                      className="pl-10"
                      value={searchParams.minPrice}
                      onChange={(e) => handleChange('minPrice', e.target.value)}
                    />
                    <Input
                      id="maxPrice"
                      placeholder="Max Rent"
                      value={searchParams.maxPrice}
                      onChange={(e) => handleChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Search className="mr-2 h-5 w-5" />
              Find Rental Properties
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertySearch;

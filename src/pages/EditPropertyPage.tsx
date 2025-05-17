import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, MapPin } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { getPropertyById, updateProperty, Property } from '@/lib/data';

const EditPropertyPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [property, setProperty] = useState<Property | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        city: '',
        area: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        type: '',
        status: '',
    });

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                const prop = await getPropertyById(id);
                if (prop) {
                    setProperty(prop);
                    setFormData({
                        title: prop.title,
                        description: prop.description,
                        address: prop.location.address,
                        city: prop.location.city,
                        area: prop.location.area,
                        price: String(prop.price),
                        bedrooms: String(prop.features.bedrooms),
                        bathrooms: String(prop.features.bathrooms),
                        type: prop.type,
                        status: prop.status,
                    });
                } else {
                    toast({
                        title: "Not Found",
                        description: "Property not found",
                        variant: "destructive",
                    });
                }
            }
        };
        loadData();
    }, [id, toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!id) return;
        const updated = await updateProperty(id, formData); // You need to define updateProperty
        if (updated) {
            toast({ title: "Success", description: "Property updated successfully!" });
            navigate(`/property/${id}`);
        } else {
            toast({ title: "Error", description: "Failed to update property", variant: "destructive" });
        }
    };

    if (!property) return null;

    return (
        <MainLayout>
            <div className="bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            className="text-muted-foreground hover:text-primary inline-flex items-center"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Back
                        </button>
                        <Button onClick={handleSubmit}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>

                    <h1 className="text-2xl font-bold mb-4">Edit Property</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardContent className=" w-full p-6 space-y-4">
                                    <div>
                                        <Label>Title</Label>
                                        <Input name="title" value={formData.title} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Textarea name="description" value={formData.description} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Price</Label>
                                            <Input name="price" value={formData.price} onChange={handleChange} type="number" />
                                        </div>
                                        <div>
                                            <Label>Bedrooms</Label>
                                            <Input name="bedrooms" value={formData.bedrooms} onChange={handleChange} type="number" />
                                        </div>
                                        <div>
                                            <Label>Bathrooms</Label>
                                            <Input name="bathrooms" value={formData.bathrooms} onChange={handleChange} type="number" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Type</Label>
                                            <Input name="type" value={formData.type} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <Label>Status</Label>
                                            <Input name="status" value={formData.status} onChange={handleChange} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="font-semibold text-lg">Location</h2>
                                    <div>
                                        <Label>Address</Label>
                                        <Input name="address" value={formData.address} onChange={handleChange} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>City</Label>
                                            <Input name="city" value={formData.city} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <Label>Area</Label>
                                            <Input name="area" value={formData.area} onChange={handleChange} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>



                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default EditPropertyPage;

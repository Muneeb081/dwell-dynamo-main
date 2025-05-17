
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyPropertiesProps {
  onAddProperty: () => void;
}

const EmptyProperties = ({ onAddProperty }: EmptyPropertiesProps) => {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Building className="h-12 w-12 mx-auto mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-1">No properties found</h3>
      <p className="text-sm">
        Start by adding your first property listing
      </p>
      <Button 
        onClick={onAddProperty} 
        variant="outline" 
        className="mt-4">
        Add Your First Property
      </Button>
    </div>
  );
};

export default EmptyProperties;

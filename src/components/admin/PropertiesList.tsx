import { Property } from '@/lib/data';
import PropertyStatusBadge from './PropertyStatusBadge';
import PropertyActions from './PropertyActions';

interface PropertiesListProps {
  properties: Property[];
  onEdit: (propertyId: string) => void;
  onRemove: (propertyId: string) => void;
  onUpdateStatus: (propertyId: string, status: 'sale' | 'rent') => void;
}

const PropertiesList = ({ properties, onEdit, onRemove, onUpdateStatus }: PropertiesListProps) => {
  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-6 bg-muted p-3 font-medium">
        <div className="col-span-2">Property</div>
        <div>Type</div>
        <div>Status</div>
        <div>Price</div>
        <div className="text-right">Actions</div>
      </div>
      
      {properties.map((property) => (
        <div key={property.id} className="grid grid-cols-6 p-3 border-t items-center">
          <div className="col-span-2">
            <div className="font-medium">{property.title}</div>
            <div className="text-sm text-muted-foreground">{property.location.area}, {property.location.city}</div>
          </div>
          <div className="capitalize">{property.type}</div>
          <div>
            <PropertyStatusBadge status={property.status} />
          </div>
          <div>${property.price.toLocaleString()}</div>
          <PropertyActions 
            propertyId={property._id} 
            currentStatus={property.status}
            onEdit={onEdit} 
            onRemove={onRemove}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertiesList;

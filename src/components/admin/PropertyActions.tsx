import { Edit, Trash2, MoreHorizontal, Home, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PropertyActionsProps {
  propertyId: string;
  currentStatus: 'sale' | 'rent';
  onEdit: (propertyId: string) => void;
  onRemove: (propertyId: string) => void;
  onUpdateStatus: (propertyId: string, status: 'sale' | 'rent') => void;
}

const PropertyActions = ({ 
  propertyId, 
  currentStatus, 
  onEdit, 
  onRemove, 
  onUpdateStatus 
}: PropertyActionsProps) => {
  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(propertyId)}>
            <Edit className="h-4 w-4 mr-2 text-blue-500" />
            Edit Property
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="flex items-center">
                {currentStatus === 'sale' ? (
                  <Home className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Building className="h-4 w-4 mr-2 text-blue-500" />
                )}
                Update Status
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onUpdateStatus(propertyId, 'sale')}>
                <Home className="h-4 w-4 mr-2 text-green-500" />
                For Sale
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(propertyId, 'rent')}>
                <Building className="h-4 w-4 mr-2 text-blue-500" />
                For Rent
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => onRemove(propertyId)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Property
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PropertyActions;

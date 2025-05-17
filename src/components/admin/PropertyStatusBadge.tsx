import { Badge } from '@/components/ui/badge';

interface PropertyStatusBadgeProps {
  status: 'sale' | 'rent';
}

const PropertyStatusBadge = ({ status }: PropertyStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'sale':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor()} border-0`}>
      {status === 'sale' ? 'For Sale' : 'For Rent'}
    </Badge>
  );
};

export default PropertyStatusBadge;

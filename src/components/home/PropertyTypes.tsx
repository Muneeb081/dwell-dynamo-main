
import { Link } from 'react-router-dom';
import { 
  Home, 
  Building, 
  Store, 
  MapPin 
} from 'lucide-react';

const PropertyTypeItem = ({ 
  icon: Icon, 
  title, 
  count, 
  link 
}: { 
  icon: React.ElementType; 
  title: string; 
  count: number; 
  link: string 
}) => {
  return (
    <Link to={link} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col items-center text-center">
        <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full mb-4">
          <Icon className="h-8 w-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="font-heading font-medium text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{count} Properties</p>
      </div>
    </Link>
  );
};

const PropertyTypes = () => {
  const types = [
    { icon: Home, title: 'Houses', count: 128, link: '/properties?type=house' },
    { icon: Building, title: 'Apartments', count: 84, link: '/properties?type=apartment' },
    { icon: Store, title: 'Commercial', count: 42, link: '/properties?type=commercial' },
    { icon: MapPin, title: 'Plots', count: 56, link: '/properties?type=plot' },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">Browse By Property Type</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of properties to find the perfect home, investment, or commercial space in Islamabad.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type, index) => (
            <PropertyTypeItem 
              key={index} 
              icon={type.icon} 
              title={type.title} 
              count={type.count} 
              link={type.link} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;

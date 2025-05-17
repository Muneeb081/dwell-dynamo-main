
import { Link } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Calculator, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  link 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  link: string 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="bg-teal-50 dark:bg-teal-900/30 rounded-full p-3 inline-block mb-4">
        <Icon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
      </div>
      <h3 className="font-heading font-semibold text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Link to={link}>
        <Button variant="link" className="p-0 text-teal-600 dark:text-teal-400 flex items-center">
          Learn More <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: Home,
      title: "Property Listings",
      description: "Browse through our extensive collection of residential and commercial properties in Islamabad.",
      link: "/properties"
    },
    {
      icon: BrainCircuit,
      title: "AI Recommendations",
      description: "Get personalized property recommendations based on your preferences and search history.",
      link: "/recommendations"
    },
    {
      icon: MessageSquare,
      title: "Property Chat",
      description: "Ask questions about properties, locations, and get instant answers from our smart assistant.",
      link: "/chat"
    },
    {
      icon: Calculator,
      title: "Construction Calculator",
      description: "Estimate construction costs for your project based on size, materials, and labor costs.",
      link: "/calculator"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of real estate services designed to make your property journey seamless.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              icon={service.icon} 
              title={service.title} 
              description={service.description} 
              link={service.link} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

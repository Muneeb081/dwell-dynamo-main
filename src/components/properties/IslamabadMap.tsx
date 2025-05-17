import { Card } from '@/components/ui/card';

interface IslamabadMapProps {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Islamabad sectors bounds (covering main residential and commercial sectors)
const ISLAMABAD_BOUNDS = {
  north: 33.7315, // Around F sectors
  south: 33.6515, // Around I sectors
  east: 73.1691,  // Eastern boundary
  west: 72.9939   // Western boundary
};

const IslamabadMap = ({ address, coordinates }: IslamabadMapProps) => {
  // Default to Islamabad center (around F-8/G-8)
  const center = coordinates || { lat: 33.6844, lng: 73.0479 };
  
  // Extract sector/area name from address
  const areaMatch = address.match(/[A-Z]-\d+/i); // Matches patterns like F-8, G-7, etc.
  const searchQuery = areaMatch 
    ? `Sector+${areaMatch[0]}+Islamabad`
    : `${address}+Islamabad`;
  
  return (
    <Card>
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=p&z=15&output=embed`}
          title={`Map showing ${address}`}
          allowFullScreen
        />
      </div>
    </Card>
  );
};

export default IslamabadMap; 
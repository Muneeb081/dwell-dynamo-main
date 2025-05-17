import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationPickerProps {
  defaultValue?: string;
  onChange: (location: {
    address: string;
    city: string;
    area: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

// Islamabad sectors data
const ISLAMABAD_SECTORS = {
  'Blue Area': { lat: 33.7294, lng: 73.0931 },
  'F Sectors': {
    'F-5': { lat: 33.7287, lng: 73.0791 },
    'F-6': { lat: 33.7252, lng: 73.0877 },
    'F-7': { lat: 33.7208, lng: 73.0567 },
    'F-8': { lat: 33.7147, lng: 73.0397 },
    'F-10': { lat: 33.6955, lng: 73.0119 },
    'F-11': { lat: 33.6849, lng: 72.9919 },
  },
  'G Sectors': {
    'G-5': { lat: 33.7167, lng: 73.0913 },
    'G-6': { lat: 33.7124, lng: 73.0877 },
    'G-7': { lat: 33.7054, lng: 73.0791 },
    'G-8': { lat: 33.6983, lng: 73.0619 },
    'G-9': { lat: 33.6912, lng: 73.0447 },
    'G-10': { lat: 33.6841, lng: 73.0275 },
    'G-11': { lat: 33.6770, lng: 73.0103 },
  },
  'I Sectors': {
    'I-8': { lat: 33.6606, lng: 73.0791 },
    'I-9': { lat: 33.6535, lng: 73.0619 },
    'I-10': { lat: 33.6464, lng: 73.0447 },
    'I-11': { lat: 33.6508, lng: 73.0326 },
  },
  'E Sectors': {
    'E-7': { lat: 33.7338, lng: 73.0447 },
    'E-11': { lat: 33.7040, lng: 72.9747 },
  },
  'H Sectors': {
    'H-8': { lat: 33.6892, lng: 73.0447 },
    'H-9': { lat: 33.6821, lng: 73.0275 },
    'H-10': { lat: 33.6750, lng: 73.0103 },
    'H-11': { lat: 33.6679, lng: 72.9931 },
  },
  'D Sectors': {
    'D-12': { lat: 33.7338, lng: 72.9919 },
  }
};

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

const LocationPicker = ({ defaultValue, onChange }: LocationPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMainArea, setSelectedMainArea] = useState<string>('');
  const [selectedSubArea, setSelectedSubArea] = useState<string>('');
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps Script
    if (!window.google) {
      setIsLoading(true);
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // Initialize the map centered on Islamabad
      const defaultLocation = { lat: 33.6844, lng: 73.0479 };
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      // Initialize the marker
      markerRef.current = new window.google.maps.Marker({
        map: googleMapRef.current,
        position: defaultLocation,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      // Initialize Places Autocomplete
      if (autocompleteInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          autocompleteInputRef.current,
          {
            componentRestrictions: { country: 'PK' },
            fields: ['address_components', 'geometry', 'formatted_address', 'name'],
            bounds: new window.google.maps.LatLngBounds(
              { lat: 33.5651, lng: 72.9539 }, // SW bounds of Islamabad
              { lat: 33.7715, lng: 73.1691 }  // NE bounds of Islamabad
            ),
            strictBounds: true
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;

          updateLocationDetails(place);
        });
      }

      // Handle marker drag
      markerRef.current.addListener('dragend', handleMarkerDragEnd);
    }
  }, [mapLoaded]);

  const handleMainAreaChange = (value: string) => {
    setSelectedMainArea(value);
    setSelectedSubArea('');

    if (value === 'Blue Area') {
      const coords = ISLAMABAD_SECTORS[value];
      updateMapPosition(coords);
      updateLocationWithSector(value);
    }
  };

  const handleSubAreaChange = (value: string) => {
    setSelectedSubArea(value);
    const coords = ISLAMABAD_SECTORS[selectedMainArea][value];
    updateMapPosition(coords);
    updateLocationWithSector(value);
  };

  const updateMapPosition = (coords: { lat: number; lng: number }) => {
    if (googleMapRef.current && markerRef.current) {
      googleMapRef.current.setCenter(coords);
      googleMapRef.current.setZoom(15);
      markerRef.current.setPosition(coords);
    }
  };

  const updateLocationWithSector = (sector: string) => {
    const position = markerRef.current.getPosition();
    onChange({
      address: `${sector}, Islamabad`,
      city: 'Islamabad',
      area: sector,
      coordinates: {
        lat: position.lat(),
        lng: position.lng(),
      },
    });
  };

  const handleMarkerDragEnd = () => {
    const position = markerRef.current.getPosition();
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode(
      { 
        location: { lat: position.lat(), lng: position.lng() },
        region: 'PK'
      },
      (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          updateLocationDetails(results[0]);
        }
      }
    );
  };

  const updateLocationDetails = (place: any) => {
    googleMapRef.current.setCenter(place.geometry.location);
    googleMapRef.current.setZoom(17);
    markerRef.current.setPosition(place.geometry.location);

    let area = '';
    place.address_components.forEach((component: any) => {
      if (component.types.includes('sublocality_level_1')) {
        area = component.long_name;
      }
    });

    if (autocompleteInputRef.current) {
      autocompleteInputRef.current.value = place.formatted_address;
    }

    onChange({
      address: place.formatted_address,
      city: 'Islamabad',
      area: area || 'Islamabad',
      coordinates: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Area</label>
          <Select value={selectedMainArea} onValueChange={handleMainAreaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose main area" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(ISLAMABAD_SECTORS).map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMainArea && selectedMainArea !== 'Blue Area' && (
          <div>
            <label className="text-sm font-medium mb-2 block">Select Sector</label>
            <Select value={selectedSubArea} onValueChange={handleSubAreaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose sector" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(ISLAMABAD_SECTORS[selectedMainArea]).map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="relative">
        <FormControl>
          <Input
            ref={autocompleteInputRef}
            placeholder="Search for a specific location in Islamabad..."
            defaultValue={defaultValue}
            className="pl-4"
          />
        </FormControl>
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>

      <Card>
        <div
          ref={mapRef}
          className="w-full h-[400px] rounded-lg overflow-hidden"
        />
      </Card>

      <p className="text-sm text-muted-foreground">
        You can either select a sector from the dropdown or search for a specific location. 
        You can also drag the marker to adjust the exact location.
      </p>
    </div>
  );
};

export default LocationPicker; 
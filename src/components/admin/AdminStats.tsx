
import { Building } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AdminStatsProps {
  propertiesCount: number;
}

const AdminStats = ({ propertiesCount }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Building className="h-5 w-5 mr-2 text-primary" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{propertiesCount}</div>
          <p className="text-sm text-muted-foreground mt-1">Total properties in the system</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;

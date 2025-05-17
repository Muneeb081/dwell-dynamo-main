
import { Shield } from 'lucide-react';

const AdminHeader = () => {
  return (
    <div className="mb-8 flex items-center space-x-2">
      <Shield className="h-8 w-8 text-primary" />
      <div>
        <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage property listings
        </p>
      </div>
    </div>
  );
};

export default AdminHeader;

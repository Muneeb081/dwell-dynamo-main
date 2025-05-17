import { Card } from '@/components/ui/card';
import { RoleSelector } from '@/components/auth/RoleSelector';

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card className="p-6">
          <RoleSelector />
        </Card>
      </div>
    </div>
  );
}

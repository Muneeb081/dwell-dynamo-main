import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Search, 
  Home, 
  Building2, 
  Calculator, 
  MessagesSquare, 
  User,
  LogIn,
  UserCircle2,
  Shield,
  Heart,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout, user, loading } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Properties', path: '/properties', icon: <Building2 size={18} /> },
    { name: 'Calculator', path: '/calculator', icon: <Calculator size={18} /> },
    { name: 'Chat', path: '/chat', icon: <MessagesSquare size={18} /> },
  ];

  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <User size={16} /> },
    { name: 'Messages', path: '/messages', icon: <MessagesSquare size={16} /> },
  ];

  if (user?.role === 'admin') {
    userMenuItems.splice(1, 0, { 
      name: 'Admin Panel', 
      path: '/admin', 
      icon: <Shield size={16} /> 
    });
  }

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-teal-700 dark:text-teal-400 font-heading font-bold text-xl">
                DwellDynamo
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 text-sm font-medium flex items-center space-x-1"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/properties">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            {loading ? (
              <Button variant="ghost" disabled className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </Button>
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="relative">
                      {user?.role === 'admin' ? <Shield size={18} /> : <UserCircle2 size={18} />}
                      <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
                    </div>
                    <span>{user?.name || (user?.role === 'admin' ? 'Admin' : 'Account')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2 mb-2 border-b">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600">
                    <LogIn size={16} className="rotate-180" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="flex items-center space-x-2">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="w-full flex items-center gap-2 text-sm"
                      onClick={() => localStorage.setItem('loginRole', 'user')}>
                      <User size={16} />
                      <div>
                        <div>User Login</div>
                        <div className="text-xs text-muted-foreground">Sign in to your account</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="w-full flex items-center gap-2 text-sm" 
                      onClick={() => localStorage.setItem('loginRole', 'admin')}>
                      <Shield size={16} />
                      <div>
                        <div>Admin Login</div>
                        <div className="text-xs text-muted-foreground">Sign in as administrator</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="flex items-center gap-2">
                      <LogIn size={16} />
                      <span>Create Account</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <span className="sr-only">Open menu</span>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-teal-700 dark:text-teal-400 font-heading font-bold text-xl">
                    DwellDynamo
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    {loading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : isLoggedIn ? (
                      <>
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="flex w-full items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 text-base font-medium"
                        >
                          <LogIn size={18} className="rotate-180" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 text-base font-medium"
                          onClick={() => {
                            localStorage.setItem('loginRole', 'user');
                            setIsOpen(false);
                          }}
                        >
                          <User size={18} />
                          <span>User Login</span>
                        </Link>
                        <Link
                          to="/login"
                          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 text-base font-medium"
                          onClick={() => {
                            localStorage.setItem('loginRole', 'admin');
                            setIsOpen(false);
                          }}
                        >
                          <Shield size={18} />
                          <span>Admin Login</span>
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 text-base font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          <LogIn size={18} />
                          <span>Create Account</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

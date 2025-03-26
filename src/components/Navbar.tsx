
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Building } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-nexgen-600">NexGen</span>
              <span className="text-xl font-semibold">Complex Hostel</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-nexgen-600 px-2 py-1 rounded-md text-sm font-medium">
              Home
            </Link>
            
            {isAuthenticated && user?.role === 'student' && (
              <Link to="/student/dashboard" className="text-gray-700 hover:text-nexgen-600 px-2 py-1 rounded-md text-sm font-medium">
                Dashboard
              </Link>
            )}
            
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-nexgen-600 px-2 py-1 rounded-md text-sm font-medium">
                Admin Panel
              </Link>
            )}

            {!isAuthenticated ? (
              <Button onClick={() => navigate('/login')} className="bg-nexgen-600 hover:bg-nexgen-700">
                Log in
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.name || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-default">
                    <User className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user?.role === 'student' && (
                    <DropdownMenuItem onClick={() => navigate('/student/dashboard')} className="cursor-pointer">
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')} className="cursor-pointer">
                      <Building className="h-4 w-4 mr-2" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

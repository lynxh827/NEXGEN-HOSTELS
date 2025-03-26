
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { AlertCircle, ArrowLeft, User, Building, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      // For demo purposes, we'll use predefined emails for different roles
      let loginEmail = email;
      
      if (role === 'student' && email === 'student') {
        loginEmail = 'student@example.com';
      } else if (role === 'admin' && email === 'admin') {
        loginEmail = 'admin@example.com';
      }
      
      const success = await login(loginEmail, password);
      
      if (success) {
        navigate(role === 'student' ? '/student/dashboard' : '/admin/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-md mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <Card className="animate-in fade-in duration-500">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
              <CardDescription>
                Choose your account type and enter your credentials
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="student" onValueChange={(value) => setRole(value as 'student' | 'admin')}>
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Administrator
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="student">
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-email">Email</Label>
                      <Input
                        id="student-email"
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        For demo, use "student" with password "password"
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="student-password">Password</Label>
                        <Button variant="link" className="p-0 h-auto text-xs" type="button">
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-nexgen-600 hover:bg-nexgen-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign in as Student'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="text"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        For demo, use "admin" with password "password"
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-password">Password</Label>
                        <Button variant="link" className="p-0 h-auto text-xs" type="button">
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-nexgen-600 hover:bg-nexgen-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign in as Administrator'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="px-6 pb-6 text-center text-sm">
              Don't have an account?{" "}
              <Button variant="link" onClick={() => navigate('/register')} className="p-0 h-auto text-nexgen-600">
                Create one
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

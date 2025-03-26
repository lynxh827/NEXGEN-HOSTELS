
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
import { UserRole } from '@/utils/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const studentSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  studentId: z.string().min(3, { message: 'Student ID is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const adminSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type StudentFormValues = z.infer<typeof studentSchema>;
type AdminFormValues = z.infer<typeof adminSchema>;

const Register = () => {
  const [role, setRole] = useState<UserRole>('student');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const studentForm = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      studentId: '',
    },
  });

  const adminForm = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onStudentSubmit = async (data: StudentFormValues) => {
    const success = await register(
      data.name,
      data.email,
      data.password,
      'student',
      data.studentId
    );
    if (success) {
      navigate('/student/dashboard');
    }
  };

  const onAdminSubmit = async (data: AdminFormValues) => {
    const success = await register(
      data.name,
      data.email,
      data.password,
      'admin'
    );
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-md mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <Card className="animate-in fade-in duration-500">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>
                Choose your account type and enter your details
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="student" onValueChange={(value) => setRole(value as UserRole)}>
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
                <Form {...studentForm}>
                  <form onSubmit={studentForm.handleSubmit(onStudentSubmit)}>
                    <CardContent className="space-y-4 pt-4">
                      <FormField
                        control={studentForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={studentForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={studentForm.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your student ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={studentForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={studentForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                            Creating account...
                          </>
                        ) : (
                          'Register as Student'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="admin">
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(onAdminSubmit)}>
                    <CardContent className="space-y-4 pt-4">
                      <FormField
                        control={adminForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={adminForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={adminForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={adminForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                            Creating account...
                          </>
                        ) : (
                          'Register as Administrator'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            
            <div className="px-6 pb-6 text-center text-sm">
              Already have an account?{" "}
              <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto text-nexgen-600">
                Sign in
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;

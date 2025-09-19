import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AuthData {
  isAuthenticated: boolean;
  user: {
    email: string;
    name?: string;
  };
  isNewUser: boolean;
}

interface SignupLoginStepProps {
  onNext: (data: AuthData) => void;
  onBack: () => void;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

export const SignupLoginStep = ({ onNext, onBack }: SignupLoginStepProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { toast } = useToast();
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const handleLogin = async () => {
    clearErrors();
    const newErrors: ValidationErrors = {};

    if (!validateEmail(loginEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePassword(loginPassword)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('travel_users') || '[]');
      const user = existingUsers.find((u: any) => 
        u.email === loginEmail && u.password === loginPassword
      );

      if (user) {
        // Store current session
        localStorage.setItem('travel_current_user', JSON.stringify({
          email: user.email,
          name: user.name
        }));

        toast({
          title: "Welcome back!",
          description: `Logged in successfully as ${user.name || user.email}`,
        });

        const authData: AuthData = {
          isAuthenticated: true,
          user: {
            email: user.email,
            name: user.name
          },
          isNewUser: false
        };

        onNext(authData);
      } else {
        setErrors({ password: 'Invalid email or password' });
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSignup = async () => {
    clearErrors();
    const newErrors: ValidationErrors = {};

    if (!validateName(signupName)) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!validateEmail(signupEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePassword(signupPassword)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('travel_users') || '[]');
      const existingUser = existingUsers.find((u: any) => u.email === signupEmail);

      if (existingUser) {
        setErrors({ email: 'An account with this email already exists' });
        toast({
          title: "Signup Failed", 
          description: "An account with this email already exists. Please login instead.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('travel_users', JSON.stringify(existingUsers));
      
      // Store current session
      localStorage.setItem('travel_current_user', JSON.stringify({
        email: newUser.email,
        name: newUser.name
      }));

      toast({
        title: "Welcome to TravelPlanner!",
        description: `Account created successfully for ${newUser.name}`,
      });

      const authData: AuthData = {
        isAuthenticated: true,
        user: {
          email: newUser.email,
          name: newUser.name
        },
        isNewUser: true
      };

      onNext(authData);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Save Your Perfect Trip</h2>
        <p className="text-muted-foreground">
          Create an account or login to save your itinerary and access it anytime
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Almost there!</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        clearErrors();
                      }}
                      className={`pl-9 ${errors.email ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        clearErrors();
                      }}
                      className={`pl-9 pr-9 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleLogin} 
                  disabled={isLoading || !loginEmail || !loginPassword}
                  className="w-full"
                  variant="travel"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Logging in...
                    </div>
                  ) : (
                    'Login to Continue'
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupName}
                      onChange={(e) => {
                        setSignupName(e.target.value);
                        clearErrors();
                      }}
                      className={`pl-9 ${errors.name ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        clearErrors();
                      }}
                      className={`pl-9 ${errors.email ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password (min 6 characters)"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        clearErrors();
                      }}
                      className={`pl-9 pr-9 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleSignup} 
                  disabled={isLoading || !signupName || !signupEmail || !signupPassword}
                  className="w-full"
                  variant="travel"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Creating account...
                    </div>
                  ) : (
                    'Create Account & Continue'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Why create an account?</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Save and access your itineraries anytime</li>
                  <li>• Get personalized travel recommendations</li>
                  <li>• Track your travel history and preferences</li>
                  <li>• Share trips with friends and family</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline">
          ← Back to Summary
        </Button>
        <Button 
          disabled
          variant="outline"
          className="opacity-50"
        >
          Continue after login →
        </Button>
      </div>
    </div>
  );
};
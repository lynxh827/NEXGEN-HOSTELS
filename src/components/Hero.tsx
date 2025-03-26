
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'student') {
      navigate('/student/dashboard');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1000&auto=format&fit=crop"
          alt="Student Hostel" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Welcome to <span className="text-nexgen-400">NexGen</span> Complex
        </h1>
        
        <p 
          className={`text-lg md:text-xl text-gray-200 max-w-3xl mb-8 transition-all duration-700 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Experience premium student living with modern amenities, community spaces,
          and a supportive environment designed for academic success.
        </p>
        
        <div 
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-nexgen-600 hover:bg-nexgen-700 text-white px-8 py-6 rounded-lg shadow-lg transition-all hover:shadow-xl flex items-center gap-2 group"
          >
            Get Started
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/#rooms')}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30 px-8 py-6 rounded-lg"
          >
            Explore Rooms
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/#rooms')}
          className="text-white opacity-70 hover:opacity-100 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Hero;

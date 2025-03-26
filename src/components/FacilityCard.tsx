
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facility } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Users } from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
}

const FacilityCard = ({ facility }: FacilityCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const occupancyPercentage = (facility.currentUsers / facility.capacity) * 100;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg card-hover">
      <div className="relative h-48 overflow-hidden">
        {/* Image with loading state */}
        <div className={`absolute inset-0 bg-gray-200 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
        <img 
          src={facility.imageUrl} 
          alt={facility.name} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)} 
        />
        
        {/* Facility type badge */}
        <div className="absolute top-3 left-3">
          <Badge className="capitalize bg-white/80 backdrop-blur-sm text-black hover:bg-white/90">
            {facility.type === 'gym' ? 'Fitness Center' : 'Swimming Pool'}
          </Badge>
        </div>
        
        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            className={`${
              facility.available && facility.currentUsers < facility.capacity
                ? 'bg-green-500/80'
                : 'bg-red-500/80'
            } backdrop-blur-sm text-white`}
          >
            {facility.available && facility.currentUsers < facility.capacity
              ? 'Available'
              : 'Full'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{facility.name}</CardTitle>
          <p className="text-lg font-semibold text-nexgen-600">Ksh {facility.price.toLocaleString()}</p>
        </div>
        <CardDescription className="line-clamp-2">
          {facility.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{facility.openingHours}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Capacity
              </span>
              <span>
                {facility.currentUsers}/{facility.capacity}
              </span>
            </div>
            <Progress 
              value={occupancyPercentage} 
              className="h-2" 
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => navigate(`/facility/${facility.id}`)} 
          disabled={!facility.available || facility.currentUsers >= facility.capacity}
          className={`w-full ${
            facility.available && facility.currentUsers < facility.capacity
              ? 'bg-nexgen-600 hover:bg-nexgen-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {facility.available && facility.currentUsers < facility.capacity
            ? 'Book Now'
            : 'Currently Full'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacilityCard;

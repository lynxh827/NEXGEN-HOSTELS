
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room } from '@/utils/types';
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
import { Wifi, Coffee, Bath, Users } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  showDetails?: boolean;
}

const RoomCard = ({ room, showDetails = true }: RoomCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'single': return <Users className="h-4 w-4" />;
      case 'double': return <Users className="h-4 w-4" />;
      case 'triple': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Wi-Fi': return <Wifi className="h-4 w-4" />;
      case 'Bathroom': return <Bath className="h-4 w-4" />;
      case 'Shared Bathroom': return <Bath className="h-4 w-4" />;
      case 'Study Desk': return <Coffee className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg card-hover">
      <div className="relative h-48 overflow-hidden">
        {/* Image with loading state */}
        <div className={`absolute inset-0 bg-gray-200 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
        <img 
          src={room.imageUrl} 
          alt={`Room ${room.number}`} 
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)} 
        />
        
        {/* Room type badge */}
        <div className="absolute top-3 left-3">
          <Badge className="capitalize bg-white/80 backdrop-blur-sm text-black hover:bg-white/90 flex items-center gap-1">
            {getRoomIcon(room.type)}
            {room.type} room
          </Badge>
        </div>
        
        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${room.available ? 'bg-green-500/80' : 'bg-red-500/80'} backdrop-blur-sm hover:bg-green-600/80 text-white`}>
            {room.available ? 'Available' : 'Occupied'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">Room {room.number}</CardTitle>
          <p className="text-lg font-semibold text-nexgen-600">Ksh {room.price.toLocaleString()}/sem</p>
        </div>
        <CardDescription className="line-clamp-2">
          {room.description}
        </CardDescription>
      </CardHeader>
      
      {showDetails && (
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-2 mt-2">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1 py-1">
                {getAmenityIcon(amenity)}
                {amenity}
              </Badge>
            ))}
            {room.amenities.length > 3 && (
              <Badge variant="outline" className="py-1">
                +{room.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      )}
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => navigate(`/room/${room.id}`)} 
          disabled={!room.available}
          className={`w-full ${room.available ? 'bg-nexgen-600 hover:bg-nexgen-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {room.available ? 'Book Room' : 'Not Available'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;

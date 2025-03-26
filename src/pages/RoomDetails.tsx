
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BookingModal from '@/components/BookingModal';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoom } = useBooking();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const room = getRoom(id || '');
  
  if (!room) {
    return <div className="container mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold">Room not found</h1>
      <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
    </div>;
  }

  const handleBookingComplete = (bookingId: string) => {
    navigate(`/booking/${bookingId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        &larr; Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <AspectRatio ratio={4/3} className="bg-muted overflow-hidden rounded-lg">
            <img 
              src={room.imageUrl || '/placeholder.svg'} 
              alt={`Room ${room.number}`} 
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{room.name || `Room ${room.number}`}</h1>
            <div className="flex items-center mt-2">
              <Badge className={room.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {room.available ? "Available" : "Occupied"}
              </Badge>
              <span className="mx-2">•</span>
              <span className="text-gray-500 capitalize">{room.type} Room</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">KSh {room.price.toLocaleString()}</h2>
            <p className="text-gray-500">per semester</p>
          </div>
          
          <p className="text-gray-700">{room.description}</p>
          
          <div>
            <h3 className="font-semibold mb-2">Amenities:</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline">{amenity}</Badge>
              ))}
            </div>
          </div>
          
          {room.available ? (
            <Button 
              className="w-full bg-nexgen-600 hover:bg-nexgen-700"
              onClick={() => setIsBookingModalOpen(true)}
            >
              Book Now
            </Button>
          ) : (
            <Button disabled className="w-full">Currently Occupied</Button>
          )}
        </div>
      </div>
      
      <Separator className="my-8" />
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Room Occupants</h2>
        {room.occupants.length === 0 ? (
          <p className="text-gray-500">This room has no occupants.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {room.occupants.map(student => (
              <Card key={student.id}>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.studentId}</p>
                  <p className="text-sm text-gray-500 mt-1">{student.email}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {room && isBookingModalOpen && (
        <BookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          type="room"
          item={room}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default RoomDetails;

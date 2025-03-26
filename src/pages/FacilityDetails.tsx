
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Clock, Users } from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const FacilityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFacility } = useBooking();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const facility = getFacility(id || '');
  
  if (!facility) {
    return <div className="container mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold">Facility not found</h1>
      <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
    </div>;
  }

  const capacityPercentage = (facility.currentUsers / facility.capacity) * 100;
  const isFull = facility.currentUsers >= facility.capacity;

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
              src={facility.imageUrl || '/placeholder.svg'} 
              alt={facility.name} 
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{facility.name}</h1>
            <div className="flex items-center mt-2">
              <Badge className={facility.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {facility.available ? "Available" : "Closed"}
              </Badge>
              <span className="mx-2">•</span>
              <span className="text-gray-500 capitalize">{facility.type}</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">KSh {facility.price.toLocaleString()}</h2>
            <p className="text-gray-500">per month</p>
          </div>
          
          <p className="text-gray-700">{facility.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{facility.openingHours}</span>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Capacity: {facility.currentUsers} / {facility.capacity}</span>
                </div>
                <span className={isFull ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                  {isFull ? "FULL" : "AVAILABLE"}
                </span>
              </div>
              <Progress value={capacityPercentage} className="h-2" />
            </div>
          </div>
          
          <Button 
            className="w-full bg-nexgen-600 hover:bg-nexgen-700"
            onClick={() => setIsBookingModalOpen(true)}
            disabled={!facility.available || isFull}
          >
            {!facility.available ? "Currently Closed" : isFull ? "Fully Booked" : "Book Now"}
          </Button>
        </div>
      </div>
      
      <Separator className="my-8" />
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">About this Facility</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700">
            Experience the best-in-class {facility.type} at NexGen Complex Hostel. Our {facility.name} is designed 
            to offer students a comprehensive experience with modern equipment and professional support.
          </p>
          
          <p className="text-gray-700 mt-4">
            The {facility.name} provides a perfect environment for students to maintain their fitness and 
            wellbeing during their academic journey. Our facility is regularly maintained and cleaned 
            to ensure the highest standards of hygiene and safety.
          </p>
          
          <p className="text-gray-700 mt-4">
            Book your spot today to secure access to this premium facility and enhance your hostel living experience.
          </p>
        </div>
      </div>
      
      {facility && isBookingModalOpen && (
        <BookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          type="facility"
          item={facility}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default FacilityDetails;

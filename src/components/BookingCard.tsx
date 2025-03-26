
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Booking, Room, Facility } from '@/utils/types';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CreditCard, ExternalLink } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  onPayClick?: (booking: Booking) => void;
  onCancelClick?: (booking: Booking) => void;
}

const BookingCard = ({ 
  booking, 
  showActions = true,
  onPayClick,
  onCancelClick
}: BookingCardProps) => {
  const { getRoom, getFacility } = useBooking();
  const [item, setItem] = useState<Room | Facility | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (booking.type === 'room') {
      const room = getRoom(booking.itemId);
      if (room) setItem(room);
    } else {
      const facility = getFacility(booking.itemId);
      if (facility) setItem(facility);
    }
  }, [booking, getRoom, getFacility]);

  if (!item) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePayClick = () => {
    if (onPayClick) {
      onPayClick(booking);
    } else {
      navigate(`/booking/${booking.id}`);
    }
  };

  const handleCancelClick = () => {
    if (onCancelClick) {
      onCancelClick(booking);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="p-4 pb-2 border-b">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {booking.type === 'room' 
                ? `Room ${(item as Room).number}` 
                : (item as Facility).name
              }
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
              <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
          <p className="text-nexgen-600 font-semibold">
            KSh {booking.amount.toLocaleString()}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 py-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Booked for: {format(new Date(booking.startDate), 'PPP')}</span>
        </div>
        
        {booking.endDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Until: {format(new Date(booking.endDate), 'PPP')}</span>
          </div>
        )}
        
        {booking.transactionId && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="h-4 w-4" />
            <span>Transaction: {booking.transactionId.substring(0, 12)}...</span>
          </div>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate(`/booking/${booking.id}`)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Details
          </Button>
          
          {booking.paymentStatus === 'pending' && (
            <Button 
              className="flex-1 bg-nexgen-600 hover:bg-nexgen-700"
              onClick={handlePayClick}
            >
              Pay Now
            </Button>
          )}
          
          {booking.status !== 'cancelled' && booking.paymentStatus === 'pending' && (
            <Button 
              variant="destructive"
              className="flex-1"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default BookingCard;

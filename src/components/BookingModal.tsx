import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBooking } from '@/contexts/BookingContext';
import { Room, Facility, Booking } from '@/utils/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'room' | 'facility';
  item: Room | Facility;
  onBookingComplete: (bookingId: string) => void;
}

const BookingModal = ({ isOpen, onClose, type, item, onBookingComplete }: BookingModalProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // Default 3 months
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  
  const { createBooking } = useBooking();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBook = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const newBooking: Omit<Booking, 'id'> = {
        userId: user.id,
        type: type,
        itemId: item.id,
        startDate: date,
        endDate: type === 'room' ? endDate : undefined,
        status: 'pending',
        paymentStatus: 'pending',
        amount: item.price,
        studentName: user.name,
        studentEmail: user.email,
        studentId: user.studentId || '',
        createdAt: new Date(),
      };
      
      // Create booking and store the returned ID
      const createdBookingId = createBooking(newBooking);
      setBookingId(createdBookingId);
      
      // Show successful booking toast notification
      toast({
        title: "Booking Successful!",
        description: `Thank you for booking ${type === 'room' ? `Room ${(item as Room).number}` : item.name}. Your booking is confirmed.`,
      });
      
      // Set booking success state to show success message
      setBookingSuccess(true);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      if (!bookingSuccess) {
        setLoading(false);
      }
    }
  };

  const handleSuccessClose = () => {
    setBookingSuccess(false);
    onClose();
    // Use the stored booking ID for the callback
    if (bookingId) {
      onBookingComplete(bookingId);
    } else if (user) {
      // Fallback to user ID if booking ID is somehow not available
      onBookingComplete(user.id);
    }
  };

  // If booking was successful, show success message
  if (bookingSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleSuccessClose()}>
        <DialogContent className="sm:max-w-[425px] animate-in slide-in-from-bottom-10 duration-300">
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center">Thank You!</h2>
            <p className="text-gray-600">Your booking has been successfully confirmed.</p>
            <p className="text-gray-600">
              {type === 'room' ? `Room ${(item as Room).number}` : item.name} has been reserved for you.
            </p>
            <Button 
              onClick={handleSuccessClose}
              className="mt-4 bg-nexgen-600 hover:bg-nexgen-700"
            >
              Go Back to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] animate-in slide-in-from-bottom-10 duration-300">
        <DialogHeader>
          <DialogTitle>Book {type === 'room' ? `Room ${(item as Room).number}` : item.name}</DialogTitle>
          <DialogDescription>
            Select {type === 'room' ? 'dates for your stay' : 'a date for your visit'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Start Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {type === 'room' && (
            <div className="space-y-2">
              <p className="text-sm font-medium">End Date</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    disabled={(date) => date < new Date() || date <= date}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <div className="pt-4">
            <div className="flex justify-between items-center py-2 border-t border-b">
              <span className="font-medium">Price</span>
              <span className="font-bold">
                KSh {item.price.toLocaleString()}
                {type === 'room' ? '/semester' : '/month'}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleBook} 
            disabled={loading}
            className="bg-nexgen-600 hover:bg-nexgen-700"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;

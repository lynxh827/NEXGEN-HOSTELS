
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Booking, Room, Facility } from '@/utils/types';
import { useBooking } from '@/contexts/BookingContext';
import { format } from 'date-fns';
import { Printer, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  isReceipt?: boolean;
}

const InvoiceModal = ({ isOpen, onClose, booking, isReceipt = false }: InvoiceModalProps) => {
  const [loading, setLoading] = useState(false);
  const { getRoom, getFacility } = useBooking();
  const { toast } = useToast();
  
  if (!booking) return null;
  
  const bookingItem = booking.type === 'room' 
    ? getRoom(booking.itemId) 
    : getFacility(booking.itemId);
    
  if (!bookingItem) return null;
  
  const invoiceNumber = `INV-${booking.id.substring(0, 8).toUpperCase()}`;
  const receiptNumber = `REC-${booking.id.substring(0, 8).toUpperCase()}`;
  const documentNumber = isReceipt ? receiptNumber : invoiceNumber;
  const title = isReceipt ? 'Payment Receipt' : 'Invoice';
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    setLoading(true);
    // Simulate PDF generation
    setTimeout(() => {
      toast({
        title: "Download Started",
        description: `Your ${isReceipt ? 'receipt' : 'invoice'} is being downloaded.`,
      });
      setLoading(false);
    }, 1500);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `NexGen Complex - ${title}`,
        text: `${title} for your booking at NexGen Complex`,
      }).catch(error => console.log('Error sharing', error));
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the share functionality. Try downloading instead.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isReceipt 
              ? 'Receipt for your completed payment' 
              : 'Invoice for your booking payment'}
          </DialogDescription>
        </DialogHeader>
        
        <div id="invoice-printable" className="p-4 bg-white rounded-md border">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-nexgen-600">NexGen Complex</h2>
              <p className="text-gray-600">Student Hostel Management</p>
              <p className="text-gray-600">Nairobi, Kenya</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-gray-600">#{documentNumber}</p>
              <p className="text-gray-600">Date: {format(new Date(), 'PPP')}</p>
            </div>
          </div>
          
          <div className="flex justify-between mb-8">
            <div>
              <h4 className="font-semibold mb-2">Billed To:</h4>
              <p>{booking.studentName || 'Student'}</p>
              <p>Student ID: {booking.studentId || 'N/A'}</p>
              <p>{booking.studentEmail || ''}</p>
            </div>
            <div className="text-right">
              <h4 className="font-semibold mb-2">Payment Details:</h4>
              <p>Status: {isReceipt ? 'Paid' : booking.paymentStatus}</p>
              {booking.paymentMethod && <p>Method: {booking.paymentMethod}</p>}
              {booking.transactionId && <p>Transaction ID: {booking.transactionId}</p>}
              {booking.paymentDate && (
                <p>Payment Date: {format(new Date(booking.paymentDate), 'PPP')}</p>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="font-semibold mb-3">Booking Details:</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Item:</p>
                  <p className="font-medium">{bookingItem.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Type:</p>
                  <p className="font-medium capitalize">{booking.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Start Date:</p>
                  <p className="font-medium">{format(new Date(booking.startDate), 'PPP')}</p>
                </div>
                {booking.endDate && (
                  <div>
                    <p className="text-gray-600">End Date:</p>
                    <p className="font-medium">{format(new Date(booking.endDate), 'PPP')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <table className="w-full mb-8">
            <thead className="border-b">
              <tr className="text-left">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3">
                  {booking.type === 'room' ? 'Room Booking' : 'Facility Reservation'} - {bookingItem.name}
                  <p className="text-gray-600 text-sm">{bookingItem.description}</p>
                </td>
                <td className="py-3 text-right">KSh {booking.amount.toLocaleString()}</td>
              </tr>
              {/* Could add taxes, discounts, etc. here */}
            </tbody>
            <tfoot className="border-t">
              <tr className="font-bold">
                <td className="py-3">Total</td>
                <td className="py-3 text-right">KSh {booking.amount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Notes:</h4>
            <p className="text-gray-600 text-sm">
              {isReceipt 
                ? 'Thank you for your payment. This receipt serves as proof of payment for the services detailed above.'
                : 'Payment is due within 7 days of receipt of this invoice. Please include your invoice number with your payment.'}
            </p>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>NexGen Complex | Student Hostel Management</p>
            <p>Email: info@nexgencomplex.com | Phone: +254 712 345 678</p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownload}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;

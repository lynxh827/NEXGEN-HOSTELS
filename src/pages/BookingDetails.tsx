
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { 
  CalendarDays, 
  Clock, 
  CreditCard, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  FileText, 
  History, 
  Bell 
} from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import InvoiceModal from '@/components/InvoiceModal';
import { Booking, Room, Facility, PaymentResponse } from '@/utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBooking, getRoom, getFacility, cancelBooking, getPaymentHistory, sendPaymentReminder } = useBooking();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const booking = getBooking(id || '');
  const paymentHistory = booking ? getPaymentHistory(booking.id) : [];
  
  if (!booking) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Booking not found</h1>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const itemDetails = booking.type === 'room' 
    ? getRoom(booking.itemId) 
    : getFacility(booking.itemId);

  if (!itemDetails) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Item details not found</h1>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const handleCancel = () => {
    cancelBooking(booking.id);
    navigate('/student/dashboard');
  };

  const handlePaymentComplete = (response: PaymentResponse) => {
    navigate('/student/dashboard');
  };

  const handleSendReminder = async () => {
    try {
      await sendPaymentReminder(booking.id);
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const getItemSpecificDetails = () => {
    if (booking.type === 'room') {
      const room = itemDetails as Room;
      return (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>Room Number: {room.number}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{room.type} Room</Badge>
          </div>
        </div>
      );
    } else {
      const facility = itemDetails as Facility;
      return (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{facility.type}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Opening Hours: {facility.openingHours}</span>
          </div>
        </div>
      );
    }
  };

  const getStatusBadge = () => {
    switch(booking.status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getPaymentStatusBadge = () => {
    switch(booking.paymentStatus) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Booking Details</CardTitle>
              <CardDescription>Reference: #{booking.id.substring(0, 8)}</CardDescription>
            </div>
            <div className="flex gap-2">
              {getStatusBadge()}
              {getPaymentStatusBadge()}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{itemDetails.name}</h3>
                <p className="text-gray-600">{itemDetails.description}</p>
                {getItemSpecificDetails()}
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Booking Date</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span>{format(new Date(booking.startDate), 'PPP')}</span>
                  </div>
                </div>
                
                {booking.endDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarDays className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(booking.endDate), 'PPP')}</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="pt-4 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Payment Details</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">KSh {booking.amount.toLocaleString()}</span>
                  </div>
                  {booking.paymentMethod && (
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{booking.paymentMethod}</span>
                    </div>
                  )}
                  {booking.transactionId && (
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-sm">{booking.transactionId}</span>
                    </div>
                  )}
                  {booking.paymentDate && (
                    <div className="flex justify-between">
                      <span>Payment Date:</span>
                      <span>{format(new Date(booking.paymentDate), 'PPP')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setIsInvoiceModalOpen(true)}
                >
                  <FileText className="h-4 w-4" />
                  View Invoice
                </Button>
                
                {booking.paymentStatus === 'paid' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setIsReceiptModalOpen(true)}
                  >
                    <FileText className="h-4 w-4" />
                    View Receipt
                  </Button>
                )}
                
                {booking.paymentStatus === 'pending' && user?.role === 'admin' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleSendReminder}
                  >
                    <Bell className="h-4 w-4" />
                    Send Reminder
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="pt-4 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Payment History</h4>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map((payment, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{payment.method} Payment</p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(payment.date), 'PPP p')}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex justify-between text-sm">
                            <span>Amount:</span>
                            <span className="font-semibold">KSh {payment.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Transaction ID:</span>
                            <span className="font-mono">{payment.id}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md bg-gray-50">
                    <History className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p>No payment history available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {booking.status !== 'cancelled' && booking.paymentStatus === 'pending' && (
              <>
                <Button 
                  className="flex-1 bg-nexgen-600 hover:bg-nexgen-700"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleCancel}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Cancel Booking
                </Button>
              </>
            )}
            {booking.paymentStatus === 'paid' && (
              <div className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-md w-full">
                <CheckCircle className="h-5 w-5 mr-2" />
                Payment completed successfully
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isPaymentModalOpen && (
        <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          booking={booking}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
      
      {isInvoiceModalOpen && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          booking={booking}
          isReceipt={false}
        />
      )}
      
      {isReceiptModalOpen && (
        <InvoiceModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          booking={booking}
          isReceipt={true}
        />
      )}
    </div>
  );
};

export default BookingDetails;

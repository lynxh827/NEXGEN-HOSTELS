import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Check, Home, MessageSquare, BellDot, ArrowLeft } from "lucide-react";
import RoomCard from "@/components/RoomCard";
import FacilityCard from "@/components/FacilityCard";
import BookingCard from "@/components/BookingCard";
import PaymentModal from "@/components/PaymentModal";
import { useNavigate } from "react-router-dom";
import { Booking, PaymentResponse } from "@/utils/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { rooms, facilities, userBookings, cancelBooking, announcements, submitComplaint } = useBooking();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");

  if (!user) {
    return <div>Loading...</div>;
  }

  const roomBookings = userBookings.filter(booking => booking.type === 'room');
  const facilityBookings = userBookings.filter(booking => booking.type === 'facility');
  
  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };
  
  const handleFacilityClick = (facilityId: string) => {
    navigate(`/facility/${facilityId}`);
  };
  
  const handleBookingClick = (bookingId: string) => {
    navigate(`/booking/${bookingId}`);
  };

  const handlePayClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handleCancelClick = (booking: Booking) => {
    cancelBooking(booking.id);
  };
  
  const handlePaymentComplete = (response: PaymentResponse) => {
    setIsPaymentModalOpen(false);
    setSelectedBooking(null);
  };

  const handleSubmitComplaint = () => {
    if (!complaintTitle.trim() || !complaintDescription.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and description",
        variant: "destructive"
      });
      return;
    }

    submitComplaint({
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      title: complaintTitle,
      description: complaintDescription,
      createdAt: new Date(),
      status: 'pending'
    });

    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been sent to the administration",
    });

    setComplaintTitle("");
    setComplaintDescription("");
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>
          <Button 
            variant="default" 
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Support Chat
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Complaints
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                  <p className="text-lg font-medium">{user.studentId || 'Not assigned'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Room</h3>
                  <p className="text-lg font-medium">{user.room || 'Not assigned'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BellDot className="h-5 w-5 text-nexgen-600" />
                    Announcements
                  </CardTitle>
                  <CardDescription>Important updates from administration</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {announcements && announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <Alert key={announcement.id} className="border-l-4 border-l-nexgen-600">
                        <AlertTitle className="flex justify-between">
                          {announcement.title}
                          <span className="text-xs text-gray-500">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                        </AlertTitle>
                        <AlertDescription>
                          {announcement.description}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No announcements at this time
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rooms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <div key={room.id} onClick={() => handleRoomClick(room.id)}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="facilities" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map(facility => (
              <div key={facility.id} onClick={() => handleFacilityClick(facility.id)}>
                <FacilityCard facility={facility} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6 space-y-6">
          {userBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-lg text-gray-500">You don't have any bookings yet.</p>
              <Button className="mt-4" onClick={() => setActiveTab("rooms")}>
                Browse Rooms
              </Button>
            </Card>
          ) : (
            <>
              {roomBookings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Room Bookings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roomBookings.map(booking => (
                      <BookingCard 
                        key={booking.id} 
                        booking={booking}
                        onPayClick={handlePayClick}
                        onCancelClick={handleCancelClick}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {facilityBookings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Facility Bookings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facilityBookings.map(booking => (
                      <BookingCard 
                        key={booking.id} 
                        booking={booking}
                        onPayClick={handlePayClick}
                        onCancelClick={handleCancelClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="complaints" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-4" />
                Submit a Complaint
              </CardTitle>
              <CardDescription>
                Let us know about any issues or concerns you're experiencing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="complaint-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  id="complaint-title"
                  placeholder="Brief title of your complaint"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="complaint-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="complaint-description"
                  placeholder="Please describe your issue in detail..."
                  rows={5}
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  className="resize-none"
                />
              </div>
              <Button onClick={handleSubmitComplaint} className="w-full">
                Submit Complaint
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedBooking && isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          booking={selectedBooking}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default StudentDashboard;

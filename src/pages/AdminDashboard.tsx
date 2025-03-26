import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Home, MessageSquare, BellDot, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Room, Student, Booking, Complaint, Announcement } from "@/utils/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { rooms, facilities, bookings, announcements, complaints, conversations, createAnnouncement, updateComplaintStatus } = useBooking();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  
  const availableRooms = rooms.filter(room => room.available);
  const occupiedRooms = rooms.filter(room => !room.available);
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const pendingComplaints = complaints ? complaints.filter(complaint => complaint.status === 'pending') : [];
  const unreadMessages = conversations ? conversations.filter(msg => !msg.isAdmin && msg.senderId !== user?.id).length : 0;
  
  if (!user || user.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  const handleCreateAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementDescription.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and description",
        variant: "destructive"
      });
      return;
    }

    createAnnouncement({
      title: announcementTitle,
      description: announcementDescription,
      createdAt: new Date()
    });

    toast({
      title: "Announcement Created",
      description: "Your announcement has been published to all students",
    });

    setAnnouncementTitle("");
    setAnnouncementDescription("");
  };

  const handleComplaintStatusUpdate = (complaintId: string, newStatus: 'resolved' | 'rejected') => {
    updateComplaintStatus(complaintId, newStatus);
    
    toast({
      title: `Complaint ${newStatus === 'resolved' ? 'Resolved' : 'Rejected'}`,
      description: `The complaint has been marked as ${newStatus}.`
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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
            {unreadMessages > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0">
                {unreadMessages}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{rooms.length}</div>
            <div className="flex mt-2 text-sm">
              <div className="mr-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Available: {availableRooms.length}
                </Badge>
              </div>
              <div>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Occupied: {occupiedRooms.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{facilities.length}</div>
            <div className="mt-2 text-sm">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Types: {new Set(facilities.map(f => f.type)).size}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pendingBookings.length}</div>
            <div className="mt-2 text-sm">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Requires action
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Complaints
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pendingComplaints.length}</div>
            <div className="mt-2 text-sm">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Pending resolution
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="rooms" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Complaints
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Chats
            {unreadMessages > 0 && (
              <Badge variant="destructive" className="ml-1">
                {unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-1">
            <BellDot className="h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms" className="mt-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge className={room.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {room.available ? "Available" : "Occupied"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KSh {room.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.occupants.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button size="sm" onClick={() => navigate(`/room/${room.id}`)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="students" className="mt-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.flatMap(room => room.occupants).map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.room || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        booking.status === 'confirmed' ? "bg-green-100 text-green-800" : 
                        booking.status === 'pending' ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        booking.paymentStatus === 'paid' ? "bg-green-100 text-green-800" : 
                        booking.paymentStatus === 'pending' ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KSh {booking.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button size="sm" onClick={() => navigate(`/booking/${booking.id}`)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="complaints" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Student Complaints
              </CardTitle>
              <CardDescription>
                Review and respond to student complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              {complaints && complaints.length > 0 ? (
                <div className="space-y-6">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{complaint.title}</h3>
                          <p className="text-sm text-gray-500">
                            From: {complaint.studentName} • {new Date(complaint.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={
                          complaint.status === 'pending' ? "bg-yellow-100 text-yellow-800" : 
                          complaint.status === 'resolved' ? "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }>
                          {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{complaint.description}</p>
                      
                      {complaint.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1 text-red-600"
                            onClick={() => handleComplaintStatusUpdate(complaint.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleComplaintStatusUpdate(complaint.id, 'resolved')}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No complaints have been submitted
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Student Chat Support
              </CardTitle>
              <CardDescription>
                View and respond to student messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversations && conversations.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversations
                    .filter(msg => !msg.isAdmin)
                    .slice(0, 5)
                    .map((message) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{message.sender}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-700 mb-4">{message.content}</p>
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => navigate('/chat')}
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Respond
                          </Button>
                        </div>
                      </div>
                    ))}
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/chat')}
                      className="flex items-center gap-2"
                    >
                      View All Messages
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No student messages yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellDot className="h-5 w-5" />
                  Create Announcement
                </CardTitle>
                <CardDescription>
                  Post important updates for all students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="announcement-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    id="announcement-title"
                    placeholder="Announcement title"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="announcement-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <Textarea
                    id="announcement-description"
                    placeholder="Announcement content..."
                    rows={5}
                    value={announcementDescription}
                    onChange={(e) => setAnnouncementDescription(e.target.value)}
                    className="resize-none"
                  />
                </div>
                <Button onClick={handleCreateAnnouncement} className="w-full">
                  Publish Announcement
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Previous Announcements</CardTitle>
                <CardDescription>
                  History of published announcements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {announcements && announcements.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {[...announcements].reverse().map((announcement) => (
                      <Alert key={announcement.id}>
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
                  <div className="text-center py-10 text-gray-500">
                    No announcements have been posted yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

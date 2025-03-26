import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Facility, Booking, PaymentResponse, Complaint, Announcement, Message } from '@/utils/types';
import { rooms as mockRooms, facilities as mockFacilities, bookings as mockBookings } from '@/utils/mockData';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BookingContextType {
  rooms: Room[];
  facilities: Facility[];
  bookings: Booking[];
  userBookings: Booking[];
  complaints: Complaint[];
  announcements: Announcement[];
  conversations: Message[] | null;
  addMessage: (message: Message) => void;
  createBooking: (booking: Omit<Booking, 'id'>) => string;
  cancelBooking: (bookingId: string) => void;
  processPayment: (bookingId: string, paymentDetails: any) => Promise<PaymentResponse>;
  generateInvoice: (bookingId: string) => string;
  sendPaymentReminder: (bookingId: string) => Promise<boolean>;
  getPaymentHistory: (bookingId: string) => any[];
  getRoom: (roomId: string) => Room | undefined;
  getFacility: (facilityId: string) => Facility | undefined;
  getBooking: (bookingId: string) => Booking | undefined;
  submitComplaint: (complaint: Omit<Complaint, 'responseMessage'>) => void;
  updateComplaintStatus: (complaintId: string, status: 'resolved' | 'rejected', responseMessage?: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Record<string, any[]>>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Welcome to NexGen Complex',
      description: 'We are excited to welcome all students to our facility. Please familiarize yourself with the community guidelines.',
      createdAt: new Date(2023, 7, 15)
    },
    {
      id: '2',
      title: 'Maintenance Schedule',
      description: 'The swimming pool will be closed for maintenance on Saturday, August 20th from 9 AM to 5 PM.',
      createdAt: new Date(2023, 7, 18)
    }
  ]);
  const [conversations, setConversations] = useState<Message[]>([]);

  const userBookings = user 
    ? bookings.filter(booking => booking.userId === user.id)
    : [];

  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    const storedFacilities = localStorage.getItem('facilities');
    const storedBookings = localStorage.getItem('bookings');
    const storedComplaints = localStorage.getItem('complaints');
    const storedAnnouncements = localStorage.getItem('announcements');
    const storedPaymentHistory = localStorage.getItem('paymentHistory');
    const storedConversations = localStorage.getItem('conversations');

    if (storedRooms) setRooms(JSON.parse(storedRooms));
    if (storedFacilities) setFacilities(JSON.parse(storedFacilities));
    if (storedBookings) setBookings(JSON.parse(storedBookings));
    if (storedComplaints) setComplaints(JSON.parse(storedComplaints));
    if (storedAnnouncements) setAnnouncements(JSON.parse(storedAnnouncements));
    if (storedPaymentHistory) setPaymentHistory(JSON.parse(storedPaymentHistory));
    if (storedConversations) setConversations(JSON.parse(storedConversations));
  }, []);

  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
    localStorage.setItem('facilities', JSON.stringify(facilities));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('complaints', JSON.stringify(complaints));
    localStorage.setItem('announcements', JSON.stringify(announcements));
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [rooms, facilities, bookings, complaints, announcements, paymentHistory, conversations]);

  const createBooking = (bookingData: Omit<Booking, 'id'>): string => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substring(2, 11),
      studentName: user?.name || 'Student',
      studentEmail: user?.email || '',
      studentId: user?.studentId || '',
      createdAt: new Date(),
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    toast({
      title: "Booking Created",
      description: "Your booking has been successfully created",
    });
    
    if (bookingData.type === 'room') {
      setRooms(prev => 
        prev.map(room => 
          room.id === bookingData.itemId 
            ? { ...room, available: false } 
            : room
        )
      );
    }

    generateInvoice(newBooking.id);
    
    return newBooking.id;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      toast({
        title: "Error",
        description: "Booking not found",
        variant: "destructive",
      });
      return;
    }
    
    setBookings(prev => 
      prev.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'cancelled' } 
          : b
      )
    );
    
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled",
    });
    
    if (booking.type === 'room') {
      setRooms(prev => 
        prev.map(room => 
          room.id === booking.itemId 
            ? { ...room, available: true } 
            : room
        )
      );
    }
  };

  const processPayment = async (bookingId: string, paymentDetails: any): Promise<PaymentResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = bookings.find(b => b.id === bookingId);
        
        if (!booking) {
          resolve({
            success: false,
            message: "Booking not found",
          });
          return;
        }
        
        if (paymentDetails.method === 'mpesa') {
          if (!paymentDetails.stk_pushed && !paymentDetails.mpesaCode) {
            resolve({
              success: false,
              message: "Please initiate M-Pesa payment first",
            });
            return;
          }
          
          if (paymentDetails.mpesaCode && paymentDetails.mpesaCode.length < 6) {
            resolve({
              success: false,
              message: "Invalid M-Pesa confirmation code",
            });
            return;
          }
        }
        
        const transactionId = Math.random().toString(36).substring(2, 15);
        const now = new Date();
        
        setBookings(prev => 
          prev.map(b => 
            b.id === bookingId 
              ? { 
                  ...b, 
                  paymentStatus: 'paid',
                  paymentMethod: paymentDetails.method,
                  transactionId: transactionId,
                  paymentDate: now,
                  phoneNumber: paymentDetails.phoneNumber || b.phoneNumber,
                } 
              : b
          )
        );
        
        const paymentRecord = {
          id: transactionId,
          bookingId: bookingId,
          method: paymentDetails.method,
          amount: booking.amount,
          status: 'completed',
          date: now,
          details: paymentDetails,
        };
        
        setPaymentHistory(prev => ({
          ...prev,
          [bookingId]: [...(prev[bookingId] || []), paymentRecord]
        }));
        
        if (paymentDetails.phoneNumber) {
          console.log(`[SMS Notification] Payment confirmation sent to ${paymentDetails.phoneNumber}`);
          // In a real app, this would call an SMS API
        }
        
        toast({
          title: "Payment Successful",
          description: `Your payment of KSh ${booking.amount.toLocaleString()} via ${paymentDetails.method.toUpperCase()} has been confirmed.`,
        });
        
        resolve({
          success: true,
          message: "Payment processed successfully",
          transactionId: transactionId,
          paymentMethod: paymentDetails.method,
          amount: booking.amount,
          timestamp: now,
        });
      }, 2000);
    });
  };

  const generateInvoice = (bookingId: string): string => {
    const invoiceId = `INV-${bookingId.substring(0, 8).toUpperCase()}`;
    console.log(`Generated invoice ${invoiceId} for booking ${bookingId}`);
    return invoiceId;
  };

  const sendPaymentReminder = async (bookingId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = bookings.find(b => b.id === bookingId);
        
        if (!booking) {
          resolve(false);
          return;
        }
        
        console.log(`[Payment Reminder] Sent to ${booking.studentName} for booking ${bookingId}`);
        
        resolve(true);
      }, 1000);
    });
  };

  const getPaymentHistory = (bookingId: string): any[] => {
    return paymentHistory[bookingId] || [];
  };

  const getRoom = (roomId: string) => rooms.find(room => room.id === roomId);
  
  const getFacility = (facilityId: string) => facilities.find(facility => facility.id === facilityId);
  
  const getBooking = (bookingId: string) => bookings.find(booking => booking.id === bookingId);

  const submitComplaint = (complaint: Omit<Complaint, 'responseMessage'>) => {
    setComplaints(prev => [...prev, complaint]);
  };

  const updateComplaintStatus = (
    complaintId: string, 
    status: 'resolved' | 'rejected', 
    responseMessage?: string
  ) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status, responseMessage } 
          : complaint
      )
    );
  };

  const createAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
    };
    
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };

  const addMessage = (message: Message) => {
    setConversations((prevMessages) => [...prevMessages, message]);
  };

  return (
    <BookingContext.Provider value={{
      rooms,
      facilities,
      bookings,
      userBookings,
      complaints,
      announcements,
      conversations,
      addMessage,
      createBooking,
      cancelBooking,
      processPayment,
      generateInvoice,
      sendPaymentReminder,
      getPaymentHistory,
      getRoom,
      getFacility,
      getBooking,
      submitComplaint,
      updateComplaintStatus,
      createAnnouncement,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

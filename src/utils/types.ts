
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  room?: string;
}

export interface Room {
  id: string;
  number: string;
  name: string;
  type: 'single' | 'double' | 'triple';
  price: number;
  available: boolean;
  amenities: string[];
  imageUrl: string;
  description: string;
  occupants: Student[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  phone: string;
  room?: string;
  bookings: Booking[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'gym' | 'pool' | 'other';
  price: number;
  available: boolean;
  capacity: number;
  currentUsers: number;
  description: string;
  imageUrl: string;
  openingHours: string;
}

export interface Booking {
  id: string;
  userId: string;
  type: 'room' | 'facility';
  itemId: string;
  startDate: Date;
  endDate?: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: Date;
  studentName?: string;
  studentEmail?: string;
  studentId?: string;
  phoneNumber?: string;
  createdAt?: Date;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
  timestamp?: Date;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  createdAt: Date;
  status: 'pending' | 'resolved' | 'rejected';
  responseMessage?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  senderId: string;
  timestamp: Date | string; // Updated to accept both Date and string
  isAdmin: boolean;
}

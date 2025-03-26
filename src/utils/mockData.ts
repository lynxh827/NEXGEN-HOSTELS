
import { User, Room, Facility, Booking, Student } from './types';

// Users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'John Student',
    email: 'student@example.com',
    role: 'student',
    studentId: 'STU001',
    room: 'A101'
  },
  {
    id: 'user-2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
];

// Students - more detailed than Users
export const students: Student[] = [
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'john@example.com',
    studentId: 'STU001',
    phone: '0712345678',
    room: 'A101',
    bookings: []
  },
  {
    id: 'student-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    studentId: 'STU002',
    phone: '0723456789',
    room: 'B202',
    bookings: []
  },
  {
    id: 'student-3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    studentId: 'STU003',
    phone: '0734567890',
    bookings: []
  }
];

// Rooms
export const rooms: Room[] = [
  {
    id: 'room-1',
    number: 'A101',
    name: 'Superior Single Room',
    type: 'single',
    price: 15000,
    available: false,
    amenities: ['Wi-Fi', 'Study Desk', 'Shared Bathroom', 'Wardrobe'],
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    description: 'Comfortable single room with basic amenities for a pleasant stay.',
    occupants: [students[0]]
  },
  {
    id: 'room-2',
    number: 'B202',
    name: 'Deluxe Double Room',
    type: 'double',
    price: 25000,
    available: false,
    amenities: ['Wi-Fi', 'Study Desk', 'Shared Bathroom', 'TV', 'Refrigerator'],
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    description: 'Spacious double room with enhanced amenities for a comfortable stay.',
    occupants: [students[1]]
  },
  {
    id: 'room-3',
    number: 'C303',
    name: 'Premium Triple Room',
    type: 'triple',
    price: 35000,
    available: true,
    amenities: ['Wi-Fi', 'Study Desk', 'Private Bathroom', 'TV', 'Refrigerator', 'Air Conditioning'],
    imageUrl: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    description: 'Luxurious triple room with premium amenities for an exceptional stay.',
    occupants: []
  },
  {
    id: 'room-4',
    number: 'D404',
    name: 'Executive Single Room',
    type: 'single',
    price: 18000,
    available: true,
    amenities: ['Wi-Fi', 'Study Desk', 'Private Bathroom', 'Wardrobe', 'Air Conditioning'],
    imageUrl: 'https://images.unsplash.com/photo-1615874694520-474822394e73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    description: 'Elegant single room with executive amenities for a refined stay.',
    occupants: []
  },
  {
    id: 'room-5',
    number: 'E505',
    name: 'Superior Double Room',
    type: 'double',
    price: 28000,
    available: true,
    amenities: ['Wi-Fi', 'Study Desk', 'Private Bathroom', 'TV', 'Refrigerator', 'Balcony'],
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    description: 'Spacious double room with superior amenities and a lovely balcony view.',
    occupants: []
  }
];

// Facilities
export const facilities: Facility[] = [
  {
    id: 'facility-1',
    name: 'Nexgen Fitness Center',
    type: 'gym',
    price: 2000,
    available: true,
    capacity: 30,
    currentUsers: 12,
    description: 'A state-of-the-art fitness center with cardio and strength training equipment.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    openingHours: '6:00 AM - 10:00 PM'
  },
  {
    id: 'facility-2',
    name: 'Nexgen Aquatic Center',
    type: 'pool',
    price: 3000,
    available: true,
    capacity: 25,
    currentUsers: 5,
    description: 'An olympic-sized swimming pool with lanes for lap swimming and a recreational area.',
    imageUrl: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    openingHours: '7:00 AM - 9:00 PM'
  },
  {
    id: 'facility-3',
    name: 'Nexgen Study Hub',
    type: 'other',
    price: 1000,
    available: true,
    capacity: 50,
    currentUsers: 20,
    description: 'A quiet study space with individual desks, group study rooms, and high-speed internet.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80',
    openingHours: '24/7'
  }
];

// Bookings
export const bookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    type: 'room',
    itemId: 'room-1',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2023-12-15'),
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    amount: 15000,
    transactionId: 'tx-123456'
  },
  {
    id: 'booking-2',
    userId: 'user-1',
    type: 'facility',
    itemId: 'facility-1',
    startDate: new Date('2023-10-15'),
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'mpesa',
    amount: 2000,
    transactionId: 'tx-234567'
  },
  {
    id: 'booking-3',
    userId: 'user-1',
    type: 'facility',
    itemId: 'facility-2',
    startDate: new Date('2023-10-20'),
    status: 'pending',
    paymentStatus: 'pending',
    amount: 3000
  }
];

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  ageRange: string;
  courseDuration: string;
  totalHours: number;
  image: string;
  rating: number;
  students: number;
  lessons: number;
  category: string;
  features: string[];
  reviews: Review[];
  courseType: 'individual' | 'corporate';
  maxParticipants?: number; // For corporate courses
  minParticipants?: number; // For corporate courses
  corporateFeatures?: string[]; // Additional features for corporate courses
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  verified: boolean;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviews: number;
  image: string;
  bio: string;
  price: number;
  availability: TimeSlot[];
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
}

export interface Transaction {
  id: string;
  type: 'course' | 'consultation';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface WishlistItem {
  id: string;
  courseId: string;
  addedDate: string;
}
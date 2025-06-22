import { ReactNode } from "react";

export interface Course {
  // Removed the index signature to avoid type conflicts
  reviews: { reviewer: string; comment: string; rating: number, date: Date }[];
  ageRange: ReactNode;
  courseDuration: ReactNode;
  totalHours: ReactNode;
  lessons: ReactNode;
  courseType: string;
  features: string[]; // Assuming features is an array of strings, adjust as needed
  corporateFeatures: string[],
  minParticipants: ReactNode;
  maxParticipants: ReactNode;
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorImage: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  image: string;
  category: 'individual' | 'corporate';
  topics: string[];
  objectives: string[];
  requirements: string[];
  curriculum: {
    module: string;
    lessons: {
      title: string;
      duration: string;
      type: 'video' | 'reading' | 'quiz' | 'assignment';
    }[];
  }[];
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  image: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviews: number;
  price: number;
  bio: string;
  availability: TimeSlot[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: 'expert' | 'patient';
  title?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  occupation?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    reminders: boolean;
  };
  createdAt: string;
  joinDate?: string; // Optional field for join date
}

export interface Transaction {
  title: string;
  id: string;
  type: 'course' | 'consultation' | 'refund';
  courseId?: string;
  expertId?: string;
  courseName?: string;
  expertName?: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'wallet' | 'cash';
  description: string;
}

// Mock wishlist storage
let mockWishlistInternal: string[] = ['1', '3']; // Pre-populate with some courses

// Mock user data
export const mockUser: User = {
  id: 'user-1',
  name: 'Nguyễn Văn A',
  email: 'user@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  role: 'patient',
  phone: '0901234567',
  dateOfBirth: '1990-05-15',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  occupation: 'Kỹ sư phần mềm',
  bio: 'Tôi là một kỹ sư phần mềm yêu thích việc học hỏi về tâm lý học để cải thiện chất lượng cuộc sống.',
  emergencyContact: {
    name: 'Nguyễn Thị B',
    phone: '0907654321',
    relationship: 'Vợ/Chồng'
  },
  preferences: {
    notifications: true,
    newsletter: true,
    reminders: true
  },
  createdAt: '2024-01-15'
};

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    type: 'course',
    courseId: '1',
    courseName: 'Quản lý Stress và Anxiety cơ bản',
    amount: 599000,
    status: 'completed',
    date: '2024-12-10',
    paymentMethod: 'credit_card',
    description: 'Thanh toán khóa học Quản lý Stress và Anxiety cơ bản',
    title: 'Thanh toán khóa học Quản lý Stress và Anxiety cơ bản',
  },
  {
    id: 'txn-002',
    type: 'consultation',
    expertId: '1',
    expertName: 'Dr. Nguyễn Minh Anh',
    amount: 500000,
    status: 'completed',
    date: '2024-12-08',
    paymentMethod: 'bank_transfer',
    description: 'Tư vấn tâm lý với Dr. Nguyễn Minh Anh - 1 giờ',
    title: 'Tư vấn tâm lý với Dr. Nguyễn Minh Anh',
  },
  {
    id: 'txn-003',
    type: 'course',
    courseId: '2',
    courseName: 'Xây dựng Tự tin và Lòng tự trọng',
    amount: 749000,
    status: 'completed',
    date: '2024-11-28',
    paymentMethod: 'credit_card',
    description: 'Thanh toán khóa học Xây dựng Tự tin và Lòng tự trọng',
    title: 'Thanh toán khóa học Xây dựng Tự tin và Lòng tự trọng',
  },
  {
    id: 'txn-004',
    type: 'consultation',
    expertId: '2',
    expertName: 'ThS. Trần Văn Bình',
    amount: 450000,
    status: 'pending',
    date: '2024-12-20',
    paymentMethod: 'wallet',
    description: 'Tư vấn tâm lý gia đình - Đang chờ xác nhận',
    title: 'Tư vấn tâm lý gia đình với ThS. Trần Văn Bình',
  },
  {
    id: 'txn-005',
    type: 'refund',
    courseId: '4',
    courseName: 'Chương trình Sức khỏe Tinh thần Doanh nghiệp',
    amount: -2000000,
    status: 'completed',
    date: '2024-11-15',
    paymentMethod: 'bank_transfer',
    description: 'Hoàn tiền khóa học doanh nghiệp - Hủy đăng ký',
    title: 'Hoàn tiền khóa học Chương trình Sức khỏe Tinh thần Doanh nghiệp',
  },
  {
    id: 'txn-006',
    type: 'consultation',
    expertId: '3',
    expertName: 'Dr. Lê Thị Cẩm',
    amount: 700000,
    status: 'failed',
    date: '2024-12-01',
    paymentMethod: 'credit_card',
    description: 'Thanh toán thất bại - Thẻ tín dụng không hợp lệ',
    title: 'Thanh toán tư vấn với Dr. Lê Thị Cẩm - Thất bại',
  }
];

// Export the wishlist array
export const mockWishlist: string[] = mockWishlistInternal;

// Mock Courses Data
export const mockCourses: Course[] = [
  // Individual Courses (599K-899K VND)
  {
    id: '1',
    title: 'Quản lý Stress và Anxiety cơ bản',
    description: 'Học cách nhận diện và quản lý stress, anxiety trong cuộc sống hàng ngày thông qua các kỹ thuật thực tế.',
    instructor: 'Dr. Nguyễn Minh Anh',
    instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=150&h=150&fit=crop',
    duration: '6 tuần',
    level: 'Beginner',
    price: 599000,
    rating: 4.8,
    students: 1247,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    category: 'individual',
    topics: ['Stress Management', 'Anxiety', 'Mindfulness', 'Breathing Techniques'],
    objectives: [
      'Nhận diện các dấu hiệu stress và anxiety',
      'Áp dụng kỹ thuật thở để giảm căng thẳng',
      'Xây dựng thói quen mindfulness hàng ngày',
      'Phát triển chiến lược đối phó với stress'
    ],
    requirements: [
      'Không cần kiến thức trước về tâm lý học',
      'Sẵn sàng dành 30 phút/ngày để thực hành',
      'Giấy bút để ghi chép'
    ],
    curriculum: [
      {
        module: 'Tuần 1: Hiểu về Stress',
        lessons: [
          { title: 'Stress là gì?', duration: '15 phút', type: 'video' },
          { title: 'Tác động của stress lên cơ thể', duration: '20 phút', type: 'reading' },
          { title: 'Đánh giá mức độ stress cá nhân', duration: '10 phút', type: 'quiz' }
        ]
      },
      {
        module: 'Tuần 2: Kỹ thuật thở',
        lessons: [
          { title: 'Thở bụng cơ bản', duration: '25 phút', type: 'video' },
          { title: 'Thực hành hàng ngày', duration: '30 phút', type: 'assignment' }
        ]
      }
    ],
    reviews: [],
    ageRange: '18-60',
    courseDuration: '6 weeks',
    totalHours: '12 hours',
    lessons: '10 lessons',
    courseType: 'Online',
    features: ['Certificate of Completion', 'Access to Resources'],
    corporateFeatures: [],
    minParticipants: '1',
    maxParticipants: '50'
  },
  {
    id: '2',
    title: 'Xây dựng Tự tin và Lòng tự trọng',
    description: 'Phát triển sự tự tin, nâng cao lòng tự trọng và xây dựng hình ảnh bản thân tích cực.',
    instructor: 'ThS. Trần Văn Bình',
    instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    duration: '8 tuần',
    level: 'Intermediate',
    price: 749000,
    originalPrice: 899000,
    rating: 4.9,
    students: 892,
    image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&h=400&fit=crop',
    category: 'individual',
    topics: ['Self-confidence', 'Self-esteem', 'Personal Development', 'Goal Setting'],
    objectives: [
      'Xác định và thay đổi suy nghĩ tiêu cực',
      'Xây dựng thói quen tích cực',
      'Đặt và đạt được mục tiêu cá nhân',
      'Cải thiện giao tiếp và mối quan hệ'
    ],
    requirements: [
      'Sẵn sàng đối mặt với thử thách cá nhân',
      'Cam kết thực hành đều đặn',
      'Giữ nhật ký tiến trình'
    ],
    curriculum: [
      {
        module: 'Tuần 1-2: Tự nhận thức',
        lessons: [
          { title: 'Đánh giá tự tin hiện tại', duration: '20 phút', type: 'quiz' },
          { title: 'Xác định điểm mạnh cá nhân', duration: '30 phút', type: 'assignment' }
        ]
      }
    ],
    reviews: [],
    ageRange: '18-60',
    courseDuration: '8 weeks',
    totalHours: '16 hours',
    lessons: '12 lessons',
    courseType: 'Online',
    features: ['Certificate of Completion', 'Access to Resources'],
    corporateFeatures: [],
    minParticipants: '1',
    maxParticipants: '50'
  },
  {
    id: '3',
    title: 'Mindfulness và Thiền định',
    description: 'Khóa học toàn diện về mindfulness và thiền định để cải thiện sức khỏe tinh thần.',
    instructor: 'Dr. Lê Thị Cẩm',
    instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    duration: '10 tuần',
    level: 'Beginner',
    price: 899000,
    rating: 4.7,
    students: 2156,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    category: 'individual',
    topics: ['Mindfulness', 'Meditation', 'Mental Health', 'Stress Relief'],
    objectives: [
      'Hiểu nguyên lý cơ bản của mindfulness',
      'Thực hành thiền định cơ bản',
      'Áp dụng mindfulness vào cuộc sống',
      'Xây dựng thói quen thiền hàng ngày'
    ],
    requirements: [
      'Không gian yên tĩnh để thực hành',
      'Thời gian ít nhất 20 phút/ngày',
      'Tâm thái cởi mở và kiên nhẫn'
    ],
    curriculum: [
      {
        module: 'Tuần 1-3: Cơ bản về Mindfulness',
        lessons: [
          { title: 'Mindfulness là gì?', duration: '25 phút', type: 'video' },
          { title: 'Thiền thở cơ bản', duration: '20 phút', type: 'video' },
          { title: 'Thực hành hàng ngày', duration: '15 phút', type: 'assignment' }
        ]
      }
    ],
    reviews: [],
    ageRange: '18-60',
    courseDuration: '10 weeks',
    totalHours: '20 hours',
    lessons: '15 lessons',
    courseType: 'Online',
    features: ['Certificate of Completion', 'Access to Resources'],
    corporateFeatures: [],
    minParticipants: '1',
    maxParticipants: '50'
  },

  // Corporate Courses (8M-18M VND)
  {
    id: '4',
    title: 'Chương trình Sức khỏe Tinh thần Doanh nghiệp',
    description: 'Chương trình toàn diện giúp doanh nghiệp xây dựng môi trường làm việc tích cực và hỗ trợ sức khỏe tinh thần nhân viên.',
    instructor: 'Team Feelosophy',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    duration: '3 tháng',
    level: 'Advanced',
    price: 12000000,
    originalPrice: 15000000,
    rating: 4.9,
    students: 45,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    category: 'corporate',
    topics: ['Corporate Wellness', 'Team Building', 'Mental Health', 'Productivity'],
    objectives: [
      'Đánh giá tình trạng sức khỏe tinh thần trong tổ chức',
      'Xây dựng chính sách hỗ trợ nhân viên',
      'Đào tạo quản lý về sức khỏe tinh thần',
      'Tạo môi trường làm việc tích cực'
    ],
    requirements: [
      'Doanh nghiệp từ 50 nhân viên trở lên',
      'Cam kết từ ban lãnh đạo',
      'Không gian đào tạo phù hợp'
    ],
    curriculum: [
      {
        module: 'Tháng 1: Đánh giá và Lập kế hoạch',
        lessons: [
          { title: 'Khảo sát sức khỏe tinh thần', duration: '2 tuần', type: 'assignment' },
          { title: 'Phân tích kết quả', duration: '1 tuần', type: 'reading' },
          { title: 'Lập kế hoạch can thiệp', duration: '1 tuần', type: 'assignment' }
        ]
      }
    ],
    reviews: [],
    ageRange: '18-60',
    courseDuration: '3 months',
    totalHours: '36 hours',
    lessons: '12 lessons',
    courseType: 'Online',
    features: ['Certificate of Completion', 'Access to Resources'],
    corporateFeatures: ['Custom Workshops', 'Employee Assessments'],
    minParticipants: '10',
    maxParticipants: '100'
  },
];

// Mock Experts Data - Updated to include Dr. Sarah Wilson
export const mockExperts: Expert[] = [
  {
    id: 'expert-demo-1',
    name: 'Dr. Sarah Wilson',
    title: 'Bác sĩ Tâm lý học Lâm sàng',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    specialization: ['Trầm cảm', 'Lo âu', 'Stress công việc', 'Tư vấn cặp đôi'],
    experience: 8,
    rating: 4.9,
    reviews: 245,
    price: 600000,
    bio: 'Dr. Sarah Wilson có hơn 8 năm kinh nghiệm trong lĩnh vực tâm lý học lâm sàng. Bà chuyên về điều trị trầm cảm, lo âu và stress công việc. Dr. Wilson đã giúp đỡ hàng trăm bệnh nhân vượt qua những thử thách trong cuộc sống và xây dựng lại sự tự tin.',
    availability: [
      { date: '2024-12-21', time: '09:00', available: true },
      { date: '2024-12-21', time: '10:30', available: true },
      { date: '2024-12-21', time: '14:00', available: false },
      { date: '2024-12-21', time: '15:30', available: true },
      { date: '2024-12-22', time: '08:30', available: true },
      { date: '2024-12-22', time: '11:00', available: true },
      { date: '2024-12-22', time: '13:30', available: false },
      { date: '2024-12-22', time: '16:00', available: true },
      { date: '2024-12-23', time: '09:30', available: true },
      { date: '2024-12-23', time: '11:30', available: true },
      { date: '2024-12-23', time: '14:30', available: true },
      { date: '2024-12-23', time: '16:30', available: false }
    ]
  },
  {
    id: '1',
    name: 'Dr. Nguyễn Minh Anh',
    title: 'Tiến sĩ Tâm lý học',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop',
    specialization: ['Trầm cảm', 'Lo âu', 'PTSD'],
    experience: 12,
    rating: 4.8,
    reviews: 189,
    price: 500000,
    bio: 'Dr. Nguyễn Minh Anh là chuyên gia hàng đầu trong lĩnh vực tâm lý học lâm sàng với hơn 12 năm kinh nghiệm. Bà chuyên điều trị các rối loạn tâm lý như trầm cảm, lo âu và PTSD.',
    availability: [
      { date: '2024-12-21', time: '08:00', available: true },
      { date: '2024-12-21', time: '09:30', available: false },
      { date: '2024-12-21', time: '11:00', available: true },
      { date: '2024-12-21', time: '14:00', available: true },
      { date: '2024-12-21', time: '15:30', available: false },
      { date: '2024-12-22', time: '08:00', available: true },
      { date: '2024-12-22', time: '10:00', available: true },
      { date: '2024-12-22', time: '13:00', available: true },
      { date: '2024-12-22', time: '15:00', available: false },
      { date: '2024-12-23', time: '09:00', available: true },
      { date: '2024-12-23', time: '11:00', available: true },
      { date: '2024-12-23', time: '14:00', available: true }
    ]
  },
  {
    id: '2',
    name: 'ThS. Trần Văn Bình',
    title: 'Thạc sĩ Tâm lý học Ứng dụng',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    specialization: ['Tư vấn gia đình', 'Tâm lý trẻ em', 'Stress'],
    experience: 8,
    rating: 4.7,
    reviews: 156,
    price: 450000,
    bio: 'ThS. Trần Văn Bình có 8 năm kinh nghiệm trong tư vấn tâm lý gia đình và trẻ em. Anh có phương pháp tiếp cận nhẹ nhàng và hiệu quả.',
    availability: [
      { date: '2024-12-21', time: '07:30', available: true },
      { date: '2024-12-21', time: '09:00', available: true },
      { date: '2024-12-21', time: '10:30', available: false },
      { date: '2024-12-21', time: '13:30', available: true },
      { date: '2024-12-21', time: '15:00', available: true },
      { date: '2024-12-22', time: '08:30', available: false },
      { date: '2024-12-22', time: '10:00', available: true },
      { date: '2024-12-22', time: '11:30', available: true },
      { date: '2024-12-22', time: '14:30', available: true },
      { date: '2024-12-23', time: '08:00', available: true },
      { date: '2024-12-23', time: '10:00', available: false },
      { date: '2024-12-23', time: '13:00', available: true }
    ]
  },
  {
    id: '3',
    name: 'Dr. Lê Thị Cẩm',
    title: 'Bác sĩ Tâm thần',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    specialization: ['Rối loạn tâm thần', 'Bipolar', 'Schizophrenia'],
    experience: 15,
    rating: 4.9,
    reviews: 203,
    price: 700000,
    bio: 'Dr. Lê Thị Cẩm là bác sĩ tâm thần với 15 năm kinh nghiệm trong điều trị các rối loạn tâm thần nghiêm trọng. Bà có chuyên môn cao và phương pháp điều trị hiện đại.',
    availability: [
      { date: '2024-12-21', time: '08:30', available: true },
      { date: '2024-12-21', time: '10:00', available: true },
      { date: '2024-12-21', time: '11:30', available: false },
      { date: '2024-12-21', time: '14:30', available: true },
      { date: '2024-12-21', time: '16:00', available: true },
      { date: '2024-12-22', time: '09:00', available: true },
      { date: '2024-12-22', time: '10:30', available: false },
      { date: '2024-12-22', time: '13:00', available: true },
      { date: '2024-12-22', time: '14:30', available: true },
      { date: '2024-12-23', time: '08:30', available: false },
      { date: '2024-12-23', time: '10:30', available: true },
      { date: '2024-12-23', time: '15:00', available: true }
    ]
  },
  {
    id: '4',
    name: 'ThS. Phạm Đức Nam',
    title: 'Chuyên gia Tâm lý Tổ chức',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    specialization: ['Tâm lý công việc', 'Coaching', 'Leadership'],
    experience: 10,
    rating: 4.6,
    reviews: 134,
    price: 550000,
    bio: 'ThS. Phạm Đức Nam chuyên về tâm lý tổ chức và coaching. Anh có 10 năm kinh nghiệm giúp các cá nhân và tổ chức phát triển hiệu quả.',
    availability: [
      { date: '2024-12-21', time: '09:00', available: false },
      { date: '2024-12-21', time: '11:00', available: true },
      { date: '2024-12-21', time: '13:00', available: true },
      { date: '2024-12-21', time: '15:00', available: true },
      { date: '2024-12-21', time: '16:30', available: false },
      { date: '2024-12-22', time: '08:00', available: true },
      { date: '2024-12-22', time: '09:30', available: true },
      { date: '2024-12-22', time: '11:00', available: false },
      { date: '2024-12-22', time: '14:00', available: true },
      { date: '2024-12-23', time: '09:30', available: true },
      { date: '2024-12-23', time: '11:30', available: true },
      { date: '2024-12-23', time: '14:30', available: false }
    ]
  },
  {
    id: '5',
    name: 'Dr. Hoàng Thị Mai',
    title: 'Tiến sĩ Tâm lý Phát triển',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=150&h=150&fit=crop',
    specialization: ['Tâm lý trẻ em', 'Phát triển nhận thức', 'Autism'],
    experience: 9,
    rating: 4.8,
    reviews: 167,
    price: 480000,
    bio: 'Dr. Hoàng Thị Mai chuyên về tâm lý phát triển và có kinh nghiệm sâu rộng trong việc hỗ trợ trẻ em có nhu cầu đặc biệt.',
    availability: [
      { date: '2024-12-21', time: '08:00', available: true },
      { date: '2024-12-21', time: '09:30', available: true },
      { date: '2024-12-21', time: '11:00', available: false },
      { date: '2024-12-21', time: '13:30', available: true },
      { date: '2024-12-21', time: '15:00', available: true },
      { date: '2024-12-22', time: '07:30', available: false },
      { date: '2024-12-22', time: '09:00', available: true },
      { date: '2024-12-22', time: '10:30', available: true },
      { date: '2024-12-22', time: '13:00', available: true },
      { date: '2024-12-23', time: '08:30', available: true },
      { date: '2024-12-23', time: '10:00', available: false },
      { date: '2024-12-23', time: '14:00', available: true }
    ]
  }
];

// Utility Functions

/**
 * Get courses by type (category)
 */
export function getCoursesByType(type: 'individual' | 'corporate' | 'all' = 'all'): Course[] {
  if (type === 'all') {
    return mockCourses;
  }
  return mockCourses.filter(course => course.category === type);
}

/**
 * Get a single course by ID
 */
export function getCourseById(id: string): Course | undefined {
  return mockCourses.find(course => course.id === id);
}

/**
 * Get expert by ID
 */
export function getExpertById(id: string): Expert | undefined {
  return mockExperts.find(expert => expert.id === id);
}

/**
 * Check if a course is in the wishlist
 */
export function isInWishlist(courseId: string): boolean {
  return mockWishlistInternal.includes(courseId);
mockWishlistInternal.includes(courseId);
}

/**
 * Toggle course in wishlist (add if not present, remove if present)
 */
export function toggleWishlist(courseId: string): boolean {
  const index = mockWishlistInternal.indexOf(courseId);
  if (index === -1) {
    // Add to wishlist
    mockWishlistInternal.push(courseId);
    return true; // Added
  } else {
    // Remove from wishlist
    mockWishlistInternal.splice(index, 1);
    return false; // Removed
  }
}

/**
 * Get all wishlist course IDs
 */
export function getWishlist(): string[] {
  return [...mockWishlistInternal];
}

/**
 * Get wishlist courses
 */
export function getWishlistCourses(): Course[] {
  return mockCourses.filter(course => mockWishlistInternal.includes(course.id));
}

/**
 * Clear all wishlist items
 */
export function clearWishlist(): void {
  mockWishlistInternal = [];
}

/**
 * Search courses by title, description, or instructor
 */
export function searchCourses(query: string): Course[] {
  const lowercaseQuery = query.toLowerCase();
  return mockCourses.filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.description.toLowerCase().includes(lowercaseQuery) ||
    course.instructor.toLowerCase().includes(lowercaseQuery) ||
    course.topics.some(topic => topic.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Filter courses by level
 */
export function getCoursesByLevel(level: 'Beginner' | 'Intermediate' | 'Advanced'): Course[] {
  return mockCourses.filter(course => course.level === level);
}

/**
 * Get courses by price range
 */
export function getCoursesByPriceRange(minPrice: number, maxPrice: number): Course[] {
  return mockCourses.filter(course => course.price >= minPrice && course.price <= maxPrice);
}

/**
 * Get top rated courses
 */
export function getTopRatedCourses(limit: number = 6): Course[] {
  return [...mockCourses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Get popular courses (by student count)
 */
export function getPopularCourses(limit: number = 6): Course[] {
  return [...mockCourses]
    .sort((a, b) => b.students - a.students)
    .slice(0, limit);
}

/**
 * Get available experts for a specific date
 */
export function getAvailableExperts(date: string): Expert[] {
  return mockExperts.filter(expert => 
    expert.availability.some(slot => slot.date === date && slot.available)
  );
}

/**
 * Get expert availability for a specific date
 */
export function getExpertAvailability(expertId: string, date: string): TimeSlot[] {
  const expert = getExpertById(expertId);
  if (!expert) return [];
  
  return expert.availability.filter(slot => slot.date === date);
}

/**
 * Book a time slot with an expert
 */
export function bookTimeSlot(expertId: string, date: string, time: string): boolean {
  const expert = mockExperts.find(e => e.id === expertId);
  if (!expert) return false;
  
  const slot = expert.availability.find(s => s.date === date && s.time === time);
  if (!slot || !slot.available) return false;
  
  slot.available = false;
  return true;
}

/**
 * Get user's purchased courses
 */
export function getUserCourses(): Course[] {
  const purchasedCourseIds = mockTransactions
    .filter(t => t.type === 'course' && t.status === 'completed')
    .map(t => t.courseId)
    .filter(Boolean) as string[];
  
  return mockCourses.filter(course => purchasedCourseIds.includes(course.id));
}

/**
 * Get transactions by type
 */
export function getTransactionsByType(type?: 'course' | 'consultation' | 'refund'): Transaction[] {
  if (!type) return mockTransactions;
  return mockTransactions.filter(t => t.type === type);
}

/**
 * Get transactions by status
 */
export function getTransactionsByStatus(status: 'completed' | 'pending' | 'failed' | 'refunded'): Transaction[] {
  return mockTransactions.filter(t => t.status === status);
}

/**
 * Calculate total spent by user
 */
export function getTotalSpent(): number {
  return mockTransactions
    .filter(t => t.status === 'completed' && t.amount > 0)
    .reduce((total, t) => total + t.amount, 0);
}

/**
 * Get user's upcoming consultations
 */
export function getUpcomingConsultations(): Transaction[] {
  return mockTransactions.filter(t => 
    t.type === 'consultation' && 
    (t.status === 'completed' || t.status === 'pending') &&
    new Date(t.date) >= new Date()
  );
}

/**
 * Add transaction
 */
export function addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
  const newTransaction: Transaction = {
    ...transaction,
    id: `txn-${Date.now()}`,
    type: "course",
    amount: 0,
    status: "completed",
    date: "",
    paymentMethod: "credit_card",
    description: ""
  };
  mockTransactions.unshift(newTransaction);
  return newTransaction;
}
export interface Course {
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
  courseImg: string;
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
  // Additional properties for CourseDetailPage
  reviews: {
    id: string;
    studentName: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }[];
  ageRange: string;
  courseDuration: string;
  courseType: 'individual' | 'corporate';
  features: string[];
  corporateFeatures?: string[];
  minParticipants?: number;
  maxParticipants?: number;
  totalHours: number;
  lessons: number;
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
}

export interface Transaction {
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
    description: 'Thanh toán khóa học Quản lý Stress và Anxiety cơ bản'
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
    description: 'Tư vấn tâm lý với Dr. Nguyễn Minh Anh - 1 giờ'
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
    description: 'Thanh toán khóa học Xây dựng Tự tin và Lòng tự trọng'
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
    description: 'Tư vấn tâm lý gia đình - Đang chờ xác nhận'
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
    description: 'Hoàn tiền khóa học doanh nghiệp - Hủy đăng ký'
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
    description: 'Thanh toán thất bại - Thẻ tín dụng không hợp lệ'
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
    reviews: [
      {
        id: 'r1',
        studentName: 'Nguyễn Thị A',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Khóa học rất hữu ích, giúp tôi hiểu rõ hơn về stress và cách quản lý nó hiệu quả.',
        date: '2024-12-15',
        verified: true
      },
      {
        id: 'r2',
        studentName: 'Trần Văn B',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        rating: 4,
        comment: 'Những kỹ thuật thở trong khóa học thực sự hiệu quả. Tôi cảm thấy thoải mái hơn nhiều.',
        date: '2024-12-10',
        verified: true
      }
    ],
    ageRange: '18-65',
    courseDuration: '6 tuần',
    courseType: 'individual',
    features: [
      'Học kỹ thuật thở để giảm stress',
      'Hiểu rõ về cơ chế hoạt động của stress',
      'Thực hành mindfulness hàng ngày',
      'Xây dựng kế hoạch quản lý stress cá nhân'
    ],
    totalHours: 12,
    lessons: 8
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
    reviews: [
      {
        id: 'r3',
        studentName: 'Lê Thị C',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Khóa học đã thay đổi cuộc sống tôi. Tôi cảm thấy tự tin hơn rất nhiều trong giao tiếp.',
        date: '2024-12-12',
        verified: true
      }
    ],
    ageRange: '18-45',
    courseDuration: '8 tuần',
    courseType: 'individual',
    features: [
      'Phát triển tự tin vượt trội',
      'Xây dựng lòng tự trọng bền vững',
      'Cải thiện kỹ năng giao tiếp',
      'Đặt và đạt được mục tiêu'
    ],
    totalHours: 16,
    lessons: 12
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
    reviews: [
      {
        id: 'r4',
        studentName: 'Phạm Văn D',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Mindfulness đã giúp tôi tìm lại sự bình an trong tâm hồn. Rất đáng để đầu tư.',
        date: '2024-12-08',
        verified: true
      }
    ],
    ageRange: '16-70',
    courseDuration: '10 tuần',
    courseType: 'individual',
    features: [
      'Học thiền định từ cơ bản đến nâng cao',
      'Thực hành mindfulness trong cuộc sống',
      'Giảm stress và lo âu hiệu quả',
      'Cải thiện chất lượng giấc ngủ'
    ],
    totalHours: 20,
    lessons: 15
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
    reviews: [
      {
        id: 'r5',
        studentName: 'HR Manager - Công ty ABC',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Chương trình đã mang lại hiệu quả rõ rệt cho tổ chức chúng tôi. Nhân viên hài lòng hơn và năng suất tăng.',
        date: '2024-11-30',
        verified: true
      }
    ],
    ageRange: '25-55',
    courseDuration: '3 tháng',
    courseType: 'corporate',
    features: [
      'Đánh giá tổng thể sức khỏe tinh thần tổ chức',
      'Xây dựng chính sách wellness toàn diện',
      'Đào tạo leadership về mental health',
      'Hỗ trợ triển khai dài hạn'
    ],
    corporateFeatures: [
      'Tư vấn onsite với đội ngũ chuyên gia',
      'Customized training theo văn hóa công ty',
      'Báo cáo định kỳ và đo lường hiệu quả',
      'Hotline hỗ trợ 24/7 cho nhân viên',
      'Certificate cho người hoàn thành'
    ],
    minParticipants: 50,
    maxParticipants: 500,
    totalHours: 48,
    lessons: 24
  },
  {
    id: '5',
    title: 'Quản lý Stress và Burnout trong Tổ chức',
    description: 'Hướng dẫn doanh nghiệp nhận diện, phòng ngừa và xử lý tình trạng stress và burnout của nhân viên.',
    instructor: 'Dr. Phạm Đức Nam',
    instructorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    duration: '6 tuần',
    level: 'Intermediate',
    price: 8500000,
    rating: 4.8,
    students: 67,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop',
    category: 'corporate',
    topics: ['Stress Management', 'Burnout Prevention', 'Employee Wellness', 'Productivity'],
    objectives: [
      'Nhận diện dấu hiệu stress và burnout',
      'Phát triển chiến lược phòng ngừa',
      'Hỗ trợ nhân viên bị ảnh hưởng',
      'Xây dựng văn hóa chăm sóc sức khỏe'
    ],
    requirements: [
      'Đội ngũ HR và quản lý tham gia',
      'Số liệu về hiệu suất nhân viên',
      'Sẵn sàng thay đổi quy trình'
    ],
    curriculum: [
      {
        module: 'Tuần 1-2: Hiểu về Stress trong Tổ chức',
        lessons: [
          { title: 'Nguyên nhân stress tại nơi làm việc', duration: '45 phút', type: 'video' },
          { title: 'Đánh giá môi trường làm việc', duration: '60 phút', type: 'assignment' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r6',
        studentName: 'CEO - Startup XYZ',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Chương trình giúp chúng tôi xây dựng môi trường làm việc khỏe mạnh hơn. Tỷ lệ nghỉ việc giảm đáng kể.',
        date: '2024-12-01',
        verified: true
      }
    ],
    ageRange: '22-60',
    courseDuration: '6 tuần',
    courseType: 'corporate',
    features: [
      'Nhận diện sớm dấu hiệu burnout',
      'Xây dựng chính sách phòng ngừa',
      'Hỗ trợ nhân viên bị ảnh hưởng',
      'Tạo văn hóa work-life balance'
    ],
    corporateFeatures: [
      'Workshop thực hành cho team leaders',
      'Toolkit đánh giá stress toàn tổ chức',
      'Session riêng cho nhân viên có nguy cơ cao',
      'Monthly check-in và coaching'
    ],
    minParticipants: 20,
    maxParticipants: 200,
    totalHours: 30,
    lessons: 18
  },
  {
    id: '6',
    title: 'Leadership và Sức khỏe Tinh thần',
    description: 'Đào tạo lãnh đạo về vai trò quan trọng trong việc hỗ trợ và duy trì sức khỏe tinh thần của đội nhóm.',
    instructor: 'ThS. Hoàng Thị Mai',
    instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=150&h=150&fit=crop',
    duration: '4 tuần',
    level: 'Advanced',
    price: 18000000,
    rating: 5.0,
    students: 23,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    category: 'corporate',
    topics: ['Leadership', 'Mental Health', 'Team Management', 'Communication'],
    objectives: [
      'Phát triển kỹ năng lãnh đạo có tâm',
      'Nhận diện và hỗ trợ nhân viên gặp khó khăn',
      'Tạo môi trường làm việc hỗ trợ',
      'Xây dựng chiến lược dài hạn'
    ],
    requirements: [
      'Vị trí quản lý cấp trung trở lên',
      'Kinh nghiệm lãnh đạo ít nhất 2 năm',
      'Cam kết áp dụng kiến thức'
    ],
    curriculum: [
      {
        module: 'Tuần 1: Lãnh đạo có Tâm',
        lessons: [
          { title: 'Emotional Intelligence cho lãnh đạo', duration: '90 phút', type: 'video' },
          { title: 'Thực hành kỹ năng lắng nghe', duration: '60 phút', type: 'assignment' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r7',
        studentName: 'Director - Tập đoàn DEF',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        rating: 5,
        comment: 'Khóa học đã thay đổi cách tôi lãnh đạo. Team work hiệu quả hơn và mọi người hạnh phúc hơn.',
        date: '2024-11-25',
        verified: true
      }
    ],
    ageRange: '30-55',
    courseDuration: '4 tuần',
    courseType: 'corporate',
    features: [
      'Phát triển emotional intelligence',
      'Kỹ năng coaching và mentoring',
      'Xây dựng team resilience',
      'Leadership trong thời đại số'
    ],
    corporateFeatures: [
      'Executive coaching 1-on-1',
      'Leadership assessment và feedback 360',
      'Simulation exercises thực tế',
      'Follow-up coaching 6 tháng'
    ],
    minParticipants: 10,
    maxParticipants: 50,
    totalHours: 24,
    lessons: 16
  }
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
    id: `txn-${Date.now()}`
  };
  mockTransactions.unshift(newTransaction);
  return newTransaction;
}
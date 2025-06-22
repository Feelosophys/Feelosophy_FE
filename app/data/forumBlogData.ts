export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  createdAt: string;
  lastActivity: string;
  isPinned?: boolean;
  isResolved?: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorAvatar: string;
  likes: number;
  createdAt: string;
  isAccepted?: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  authorTitle: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
  likes: number;
  views: number;
  publishedAt: string;
  featured?: boolean;
}

export const forumCategories = [
  'Tất cả',
  'Stress & Anxiety', 
  'Trầm cảm',
  'Mối quan hệ',
  'Phát triển bản thân',
  'Tâm lý học tích cực',
  'Kỹ năng sống',
  'Chia sẻ kinh nghiệm'
];

export const blogCategories = [
  'Tất cả',
  'Tâm lý học',
  'Sức khỏe tinh thần', 
  'Mối quan hệ',
  'Phát triển cá nhân',
  'Nghiên cứu',
  'Lời khuyên chuyên gia'
];

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Làm sao để vượt qua cảm giác lo lắng khi phải nói trước đám đông?',
    content: 'Mình có một presentation quan trọng tuần tới nhưng cứ nghĩ đến việc đứng trước nhiều người là tim đập thình thịch. Các bạn có kinh nghiệm gì để chia sẻ không?',
    author: 'Minh An',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop',
    category: 'Stress & Anxiety',
    tags: ['speaking anxiety', 'presentation', 'public speaking'],
    likes: 24,
    replies: 8,
    views: 156,
    createdAt: '2024-06-15T10:30:00',
    lastActivity: '2024-06-15T14:22:00',
    isPinned: true
  },
  {
    id: '2', 
    title: 'Chia sẻ những cách thực hành mindfulness hàng ngày',
    content: 'Mình đã áp dụng mindfulness được 3 tháng và thấy có nhiều thay đổi tích cực. Muốn chia sẻ một số tips nhỏ cho những bạn mới bắt đầu...',
    author: 'Thu Hương',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=50&h=50&fit=crop',
    category: 'Tâm lý học tích cực',
    tags: ['mindfulness', 'meditation', 'daily practice'],
    likes: 45,
    replies: 12,
    views: 234,
    createdAt: '2024-06-14T16:45:00',
    lastActivity: '2024-06-15T09:15:00'
  },
  {
    id: '3',
    title: 'Làm thế nào để xử lý mâu thuẫn trong gia đình?',
    content: 'Gia đình mình gần đây hay có những tranh cãi nhỏ, tạo không khí căng thẳng. Mọi người có lời khuyên nào để cải thiện communication không?',
    author: 'Đức Nam',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    category: 'Mối quan hệ',
    tags: ['family conflict', 'communication', 'relationships'],
    likes: 18,
    replies: 15,
    views: 189,
    createdAt: '2024-06-13T11:20:00',
    lastActivity: '2024-06-14T20:30:00',
    isResolved: true
  },
  {
    id: '4',
    title: 'Tự tin hơn sau khi tham gia khóa học "Xây dựng lòng tự tin"',
    content: 'Vừa hoàn thành khóa học với ThS. Trần Văn Dũng và thấy mình thay đổi rất nhiều. Muốn chia sẻ journey của mình để động viên các bạn khác...',
    author: 'Linh Chi',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
    category: 'Phát triển bản thân',
    tags: ['self confidence', 'personal growth', 'success story'],
    likes: 67,
    replies: 23,
    views: 445,
    createdAt: '2024-06-12T14:10:00',
    lastActivity: '2024-06-15T11:45:00'
  },
  {
    id: '5',
    title: 'Cách đối phó với burnout trong công việc?',
    content: 'Dạo này cảm thấy mệt mỏi, thiếu động lực với công việc. Có ai từng trải qua tình trạng này không? Chia sẻ cách các bạn vượt qua nhé.',
    author: 'Quang Huy',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop',
    category: 'Stress & Anxiety',
    tags: ['burnout', 'work stress', 'motivation'],
    likes: 31,
    replies: 19,
    views: 267,
    createdAt: '2024-06-11T09:30:00',
    lastActivity: '2024-06-13T16:22:00'
  }
];

export const mockForumReplies: ForumReply[] = [
  {
    id: '1',
    postId: '1',
    content: 'Mình từng gặp tình huống tương tự. Cách hiệu quả nhất là luyện tập trước gương và thở sâu trước khi lên sân khấu. Chuẩn bị kỹ nội dung cũng giúp tăng tự tin đấy!',
    author: 'Phương Anh',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop',
    likes: 12,
    createdAt: '2024-06-15T11:15:00',
    isAccepted: true
  },
  {
    id: '2',
    postId: '1',
    content: 'Thử kỹ thuật visualization nhé - tưởng tượng mình thuyết trình thành công. Và nhớ là khán giả cũng muốn bạn thành công, họ không phải kẻ thù đâu 😊',
    author: 'Bác sĩ Tâm',
    authorAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop',
    likes: 8,
    createdAt: '2024-06-15T12:30:00'
  }
];

export const mockBlogArticles: BlogArticle[] = [
  {
    id: '1',
    title: '5 Kỹ thuật thở để giảm căng thẳng trong 5 phút',
    excerpt: 'Khám phá những kỹ thuật thở đơn giản nhưng hiệu quả để nhanh chóng giảm căng thẳng và lấy lại bình tĩnh trong cuộc sống hàng ngày.',
    content: `
# 5 Kỹ thuật thở để giảm căng thẳng trong 5 phút

Trong cuộc sống hiện đại đầy áp lực, việc biết cách quản lý căng thẳng là một kỹ năng vô cùng quan trọng. Một trong những cách đơn giản và hiệu quả nhất để làm dịu tâm trí là thông qua việc điều chỉnh hơi thở.

## 1. Kỹ thuật thở 4-7-8

Đây là kỹ thuật được bác sĩ Andrew Weil phổ biến, rất hiệu quả trong việc giảm lo âu:

- Hít vào qua mũi trong 4 giây
- Nín thở trong 7 giây  
- Thở ra qua miệng trong 8 giây
- Lặp lại 3-4 lần

## 2. Thở bụng sâu

Kỹ thuật này giúp kích hoạt hệ thần kinh phó giao cảm, tạo cảm giác thư giãn:

- Đặt một tay lên ngực, một tay lên bụng
- Thở sâu qua mũi, để bụng nâng lên
- Thở ra chậm qua miệng
- Tập trung vào việc bụng di chuyển nhiều hơn ngực

## 3. Thở đếm ngược

Phương pháp này kết hợp thở với việc tập trung tâm trí:

- Thở vào và thở ra tự nhiên
- Đếm ngược từ 10 xuống 1
- Mỗi lần thở ra, đếm giảm một số
- Nếu mất tập trung, bắt đầu lại từ 10

## 4. Thở hình vuông (Box Breathing)

Được sử dụng bởi lực lượng đặc biệt để duy trì bình tĩnh:

- Hít vào trong 4 giây
- Nín thở trong 4 giây
- Thở ra trong 4 giây  
- Nín thở trong 4 giây
- Lặp lại chu kỳ

## 5. Thở theo nhịp tim

Kỹ thuật này giúp đồng bộ hóa nhịp tim và hơi thở:

- Đặt tay lên tim để cảm nhận nhịp đập
- Hít vào trong 5 nhịp đập tim
- Thở ra trong 5 nhịp đập tim
- Tiếp tục trong 2-3 phút

## Kết luận

Những kỹ thuật thở này có thể thực hiện ở bất cứ đâu và bất cứ khi nào bạn cần. Hãy luyện tập thường xuyên để chúng trở thành phản xạ tự nhiên khi bạn gặp căng thẳng.

*Lưu ý: Nếu bạn có vấn đề về hô hấp hoặc tim mạch, hãy tham khảo ý kiến bác sĩ trước khi thực hiện.*
    `,
    author: 'TS. Nguyễn Minh Hạnh',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop',
    authorTitle: 'Tiến sĩ Tâm lý học',
    category: 'Sức khỏe tinh thần',
    tags: ['breathing', 'stress relief', 'mindfulness', 'anxiety'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    readTime: 5,
    likes: 124,
    views: 856,
    publishedAt: '2024-06-10T09:00:00',
    featured: true
  },
  {
    id: '2',
    title: 'Tâm lý học tích cực: Khoa học về hạnh phúc',
    excerpt: 'Khám phá những nghiên cứu mới nhất về tâm lý học tích cực và cách áp dụng các nguyên tắc này để xây dựng cuộc sống hạnh phúc hơn.',
    content: `
# Tâm lý học tích cực: Khoa học về hạnh phúc

Tâm lý học tích cực là một lĩnh vực nghiên cứu tương đối mới, tập trung vào những yếu tố tạo nên cuộc sống ý nghĩa và hạnh phúc thay vì chỉ điều trị bệnh tật tâm lý.

## Lịch sử và định nghĩa

Được Martin Seligman khởi xướng vào cuối những năm 1990, tâm lý học tích cực nghiên cứu ba trụ cột chính:
- Cảm xúc tích cực
- Tính cách tích cực  
- Tổ chức tích cực

## Mô hình PERMA

Seligman đề xuất mô hình PERMA để mô tả các yếu tố của sự thịnh vượng:

### P - Positive Emotions (Cảm xúc tích cực)
- Niềm vui, biết ơn, hy vọng
- Mở rộng tầm nhìn và xây dựng nguồn lực

### E - Engagement (Sự tham gia)
- Trạng thái "flow" khi làm việc
- Sử dụng điểm mạnh cá nhân

### R - Relationships (Mối quan hệ)
- Con người là sinh vật xã hội
- Mối quan hệ chất lượng là chìa khóa hạnh phúc

### M - Meaning (Ý nghĩa)
- Mục đích sống lớn hơn bản thân
- Cống hiến cho cộng đồng

### A - Achievement (Thành tựu)
- Hoàn thành mục tiêu
- Cảm giác tự hào về bản thân

## Ứng dụng thực tế

### 1. Nhật ký biết ơn
Viết 3 điều biết ơn mỗi ngày để tăng cảm xúc tích cực.

### 2. Sử dụng điểm mạnh
Xác định và phát huy những thế mạnh tự nhiên của bạn.

### 3. Xây dựng mối quan hệ
Đầu tư thời gian cho gia đình và bạn bè.

### 4. Tìm ý nghĩa
Kết nối hoạt động hàng ngày với giá trị lớn hơn.

## Nghiên cứu khoa học

Các nghiên cứu cho thấy:
- Người hạnh phúc sống lâu hơn 7-10 năm
- Có hệ miễn dịch mạnh hơn
- Thu nhập cao hơn và thành công hơn trong sự nghiệp
- Có mối quan hệ ổn định hơn

## Kết luận

Tâm lý học tích cực không phải là "tư duy tích cực" đơn thuần, mà là một khoa học có căn cứ về cách xây dựng cuộc sống thịnh vượng.
    `,
    author: 'ThS. Trần Văn Dũng',
    authorAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop',
    authorTitle: 'Thạc sĩ Tâm lý học',
    category: 'Tâm lý học',
    tags: ['positive psychology', 'happiness', 'wellbeing', 'PERMA'],
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    readTime: 8,
    likes: 89,
    views: 623,
    publishedAt: '2024-06-08T14:30:00'
  },
  {
    id: '3',
    title: 'Làm thế nào để xây dựng thói quen tích cực bền vững?',
    excerpt: 'Hướng dẫn chi tiết về cách hình thành và duy trì những thói quen tích cực dựa trên nghiên cứu khoa học về não bộ và hành vi.',
    content: `
# Làm thế nào để xây dựng thói quen tích cực bền vững?

Thói quen chiếm khoảng 40-45% các hành động hàng ngày của chúng ta. Việc hiểu cách thức hoạt động của thói quen sẽ giúp chúng ta xây dựng cuộc sống tích cực hơn.

## Khoa học về thói quen

### Vòng lặp thói quen
Theo Charles Duhigg, mọi thói quen đều có 3 thành phần:
1. **Cue (Tín hiệu)** - Kích hoạt hành vi
2. **Routine (Thói quen)** - Hành vi thực tế
3. **Reward (Phần thưởng)** - Lợi ích nhận được

### Vai trò của não bộ
- Thói quen được lưu trữ ở hạch nền (basal ganglia)
- Giúp não bộ tiết kiệm năng lượng
- Tự động hóa các hành vi lặp lại

## Chiến lược xây dựng thói quen mới

### 1. Bắt đầu nhỏ (Start Small)
- Chọn hành vi đơn giản (2 phút hoặc ít hơn)
- Ví dụ: đọc 1 trang sách thay vì 1 cuốn
- Tập trung vào tính nhất quán hơn cường độ

### 2. Habit Stacking
- Gắn thói quen mới với thói quen đã có
- Công thức: "Sau khi tôi [thói quen cũ], tôi sẽ [thói quen mới]"
- Ví dụ: "Sau khi pha cà phê, tôi sẽ viết 3 điều biết ơn"

### 3. Thiết kế môi trường
- Làm cho tín hiệu dễ thấy
- Giảm ma sát cho hành vi tích cực
- Tăng ma sát cho hành vi tiêu cực

### 4. Theo dõi tiến độ
- Sử dụng habit tracker
- Ghi lại những thành công nhỏ
- Tạo "chuỗi thành công" không bị phá vỡ

## Thói quen tích cực đáng thử

### Sáng
- Thiền 5 phút
- Viết nhật ký biết ơn
- Tập thể dục nhẹ

### Trưa  
- Đi bộ 10 phút
- Thực hành breathing exercise
- Ăn trưa chánh niệm

### Tối
- Đọc sách 15 phút
- Lập kế hoạch ngày mai
- Thực hành thư giãn

## Vượt qua trở ngại

### Khi thiếu động lực
- Nhớ rằng động lực không ổn định
- Tập trung xây dựng hệ thống
- Làm version tối thiểu (2-minute rule)

### Khi bị gián đoạn
- Không để 1 ngày nghỉ thành 2 ngày
- "Miss one, don't miss two"
- Quay lại ngay sau khi có thể

### Khi không thấy kết quả
- Thói quen cần 21-66 ngày để hình thành
- Kết quả thường trễ hơn nỗ lực
- Tập trung vào process hơn outcome

## Kết luận

Xây dựng thói quen tích cực là một nghệ thuật và khoa học. Hãy kiên nhẫn với bản thân và nhớ rằng những thay đổi nhỏ, nhất quán sẽ tạo ra tác động lớn trong dài hạn.
    `,
    author: 'TS. Lê Thị Hương',
    authorAvatar: 'https://images.unsplash.com/photo-1594824962330-1e35e6fe3286?w=50&h=50&fit=crop',
    authorTitle: 'Tiến sĩ Tâm lý học',
    category: 'Phát triển cá nhân',
    tags: ['habits', 'behavior change', 'personal development', 'routine'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    readTime: 7,
    likes: 156,
    views: 934,
    publishedAt: '2024-06-05T16:45:00'
  },
  {
    id: '4',
    title: 'Hiểu về trầm cảm: Dấu hiệu, nguyên nhân và cách điều trị',
    excerpt: 'Cẩm nang toàn diện về trầm cảm - một trong những rối loạn tâm lý phổ biến nhất hiện nay, cùng các phương pháp điều trị hiệu quả.',
    content: `
# Hiểu về trầm cảm: Dấu hiệu, nguyên nhân và cách điều trị

Trầm cảm là một rối loạn tâm lý nghiêm trọng ảnh hưởng đến cách bạn cảm nhận, suy nghĩ và xử lý các hoạt động hàng ngày.

## Dấu hiệu nhận biết

### Triệu chứng tâm lý
- Tâm trạng buồn bã kéo dài
- Mất hứng thú với các hoạt động yêu thích
- Cảm giác tuyệt vọng, vô giá trị
- Khó tập trung và ra quyết định
- Ý nghĩ tiêu cực về bản thân

### Triệu chứng thể chất
- Thay đổi giấc ngủ (ngủ quá nhiều hoặc mất ngủ)
- Thay đổi cảm giác thèm ăn
- Mệt mỏi, thiếu năng lượng
- Đau đầu, đau cơ không rõ nguyên nhân
- Chậm chạp trong cử động

### Triệu chứng xã hội
- Tránh tiếp xúc với người khác
- Giảm hiệu suất làm việc/học tập
- Khó duy trì mối quan hệ
- Rút lui khỏi các hoạt động xã hội

## Nguyên nhân

### Yếu tố sinh học
- Di truyền (20-30% nguy cơ nếu có người thân mắc bệnh)
- Mất cân bằng chất dẫn truyền thần kinh
- Thay đổi hormone
- Bệnh lý não bộ

### Yếu tố tâm lý
- Trauma trong quá khứ
- Lòng tự trọng thấp
- Tính cách hoàn hảo chủ nghĩa
- Kiểu tư duy tiêu cực

### Yếu tố môi trường
- Stress kéo dài
- Mất mát quan trọng
- Khó khăn tài chính
- Xung đột trong các mối quan hệ
- Tác dụng phụ của thuốc

## Các loại trầm cảm

### Major Depression
- Triệu chứng nghiêm trọng kéo dài ít nhất 2 tuần
- Ảnh hưởng lớn đến chức năng hàng ngày

### Persistent Depressive Disorder (Dysthymia)
- Triệu chứng nhẹ hơn nhưng kéo dài ít nhất 2 năm
- Có thể xen kẽ các đợt trầm cảm nặng

### Seasonal Affective Disorder (SAD)
- Liên quan đến thay đổi mùa (thường mùa đông)
- Do thiếu ánh sáng mặt trời

### Postpartum Depression
- Xảy ra sau khi sinh con
- Nghiêm trọng hơn "baby blues" thông thường

## Phương pháp điều trị

### Liệu pháp tâm lý
**Cognitive Behavioral Therapy (CBT)**
- Thay đổi patterns tư duy tiêu cực
- Học kỹ năng ứng phó với stress
- Hiệu quả cao cho trầm cảm nhẹ đến trung bình

**Interpersonal Therapy (IPT)**
- Tập trung vào cải thiện mối quan hệ
- Phù hợp với trầm cảm do vấn đề quan hệ

**Dialectical Behavior Therapy (DBT)**
- Học kỹ năng điều chỉnh cảm xúc
- Phù hợp với trầm cảm kèm theo hành vi tự hại

### Thuốc điều trị
- **SSRI**: Prozac, Zoloft, Lexapro
- **SNRI**: Effexor, Cymbalta
- **Atypical**: Wellbutrin, Remeron

*Lưu ý: Chỉ sử dụng thuốc khi có chỉ định của bác sĩ*

### Liệu pháp bổ trợ
- Tập thể dục thường xuyên
- Thiền và mindfulness
- Liệu pháp ánh sáng (cho SAD)
- Thay đổi chế độ ăn uống
- Hỗ trợ xã hội

## Khi nào cần tìm kiếm giúp đỡ?

Hãy tìm kiếm sự giúp đỡ chuyên nghiệp nếu:
- Triệu chứng kéo dài hơn 2 tuần
- Ảnh hưởng đến công việc, học tập, mối quan hệ
- Có ý nghĩ tự hại hoặc tự tử
- Sử dụng rượu bia hoặc chất kích thích để đối phó

## Hỗ trợ người thân

### Những việc nên làm
- Lắng nghe không phán xét
- Khuyến khích điều trị chuyên nghiệp
- Kiên nhẫn và thông cảm
- Giúp duy trì hoạt động hàng ngày

### Những việc không nên làm
- Nói "hãy tích cực lên"
- Bỏ qua các triệu chứng
- Buộc tham gia hoạt động xã hội
- Đổ lỗi cho họ

## Kết luận

Trầm cảm là một bệnh thật, không phải là dấu hiệu của sự yếu đuối. Với điều trị phù hợp, đa số người mắc trầm cảm có thể phục hồi và sống một cuộc sống trọn vẹn.

*Nếu bạn đang gặp khó khăn, hãy liên hệ với chuyên gia tâm lý hoặc đường dây nóng hỗ trợ tâm lý.*
    `,
    author: 'TS. Nguyễn Minh Hạnh',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop',
    authorTitle: 'Tiến sĩ Tâm lý học',
    category: 'Sức khỏe tinh thần',
    tags: ['depression', 'mental health', 'treatment', 'symptoms'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    readTime: 12,
    likes: 203,
    views: 1247,
    publishedAt: '2024-06-01T10:15:00',
    featured: true
  }
];
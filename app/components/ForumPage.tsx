"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { 
  Search, 
  MessageSquare, 
  Heart, 
  Eye, 
  Clock, 
  Pin, 
  CheckCircle, 
  Plus,
  ArrowUp,
  Filter,
  TrendingUp
} from 'lucide-react';
import { mockForumPosts, mockForumReplies, forumCategories, ForumPost } from '../data/forumBlogData';

export function ForumPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
    category: 'Stress & Anxiety',
    tags: ''
  });

  const filteredPosts = mockForumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'replies':
        return b.replies - a.replies;
      case 'views':
        return b.views - a.views;
      default: // recent
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    }
  });

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  const handleCreatePost = () => {
    // Simulate creating a new post
    setShowNewPost(false);
    setNewPostData({ title: '', content: '', category: 'Stress & Anxiety', tags: '' });
  };

  const postReplies = mockForumReplies.filter(reply => reply.postId === selectedPost?.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Cộng đồng Forum</h1>
              <p className="text-gray-600">
                Nơi chia sẻ, thảo luận và hỗ trợ lẫn nhau về sức khỏe tâm lý
              </p>
            </div>
            <Button 
              onClick={() => setShowNewPost(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài viết
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-bold text-lg">1,234</div>
                    <div className="text-sm text-gray-600">Bài viết</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-bold text-lg">5,678</div>
                    <div className="text-sm text-gray-600">Thảo luận</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-bold text-lg">12,456</div>
                    <div className="text-sm text-gray-600">Lượt thích</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-bold text-lg">89,123</div>
                    <div className="text-sm text-gray-600">Lượt xem</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Chọn chủ đề" />
              </SelectTrigger>
              <SelectContent>
                {forumCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mới nhất</SelectItem>
                <SelectItem value="popular">Phổ biến</SelectItem>
                <SelectItem value="replies">Nhiều phản hồi</SelectItem>
                <SelectItem value="views">Nhiều lượt xem</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Tất cả');
                setSortBy('recent');
              }}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="ring-2 ring-blue-100">
                    <AvatarImage src={post.authorAvatar} alt={post.author} />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {post.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                          {post.isResolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="font-medium">{post.author}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(post.createdAt)}</span>
                          <span>•</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-600">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác
            </p>
          </div>
        )}
      </div>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedPost && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center space-x-2 mb-2">
                  {selectedPost.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                  {selectedPost.isResolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                  <DialogTitle className="text-xl">{selectedPost.title}</DialogTitle>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={selectedPost.authorAvatar} alt={selectedPost.author} />
                    <AvatarFallback>{selectedPost.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{selectedPost.author}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(selectedPost.createdAt)}</span>
                  <span>•</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {selectedPost.category}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Post Content */}
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-blue-200 text-blue-600">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between border-t border-blue-100 pt-4">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                    <Heart className="h-4 w-4 mr-1" />
                    {selectedPost.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {selectedPost.replies}
                  </Button>
                  <span className="text-sm text-gray-600 flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {selectedPost.views} lượt xem
                  </span>
                </div>
              </div>

              <Separator />

              {/* Replies */}
              <div>
                <h4 className="font-semibold mb-4">Phản hồi ({postReplies.length})</h4>
                <div className="space-y-4">
                  {postReplies.map((reply) => (
                    <div key={reply.id} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={reply.authorAvatar} alt={reply.author} />
                          <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-sm">{reply.author}</span>
                            <span className="text-xs text-gray-600">{formatTimeAgo(reply.createdAt)}</span>
                            {reply.isAccepted && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                Câu trả lời hay
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{reply.content}</p>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 p-0 h-auto">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-white/80">
                  <Textarea 
                    placeholder="Viết phản hồi của bạn..."
                    className="mb-3 border-blue-200 focus:border-blue-400"
                    rows={3}
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Gửi phản hồi
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo bài viết mới</DialogTitle>
            <DialogDescription>
              Chia sẻ câu hỏi, kinh nghiệm hoặc thảo luận của bạn với cộng đồng
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề</label>
              <Input
                value={newPostData.title}
                onChange={(e) => setNewPostData({...newPostData, title: e.target.value})}
                placeholder="Nhập tiêu đề bài viết..."
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Chủ đề</label>
              <Select 
                value={newPostData.category} 
                onValueChange={(value) => setNewPostData({...newPostData, category: value})}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {forumCategories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nội dung</label>
              <Textarea
                value={newPostData.content}
                onChange={(e) => setNewPostData({...newPostData, content: e.target.value})}
                placeholder="Chia sẻ suy nghĩ, câu hỏi hoặc kinh nghiệm của bạn..."
                rows={6}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tags (phân cách bằng dấu phẩy)</label>
              <Input
                value={newPostData.tags}
                onChange={(e) => setNewPostData({...newPostData, tags: e.target.value})}
                placeholder="anxiety, stress, tips..."
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700">
                Đăng bài
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
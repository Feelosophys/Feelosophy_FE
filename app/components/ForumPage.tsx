"use client"

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
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
  TrendingUp,
  Share2,
  Bookmark,
  MoreHorizontal,
  Reply,
  X,
  Loader2
} from 'lucide-react';
import { mockForumReplies, forumCategories, ForumPost, ForumReply } from '../data/forumBlogData';
import { apiClient } from '../../lib/api';
import { CreateForumPostData, CreateForumCommentData, ForumReactionData } from '../../lib/types';

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
  const [newReply, setNewReply] = useState('');

  // API state
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingPost, setCreatingPost] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  // Fetch forum posts on component mount
  useEffect(() => {
    fetchForumPosts();
  }, []);

  const fetchForumPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getForumPosts();
      if (response.success && response.data) {
        setPosts(response.data);
      } else {
        setError(response.error || 'Failed to fetch forum posts');
      }
    } catch (err) {
      setError('Failed to fetch forum posts');
      console.error('Error fetching forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
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

  const handleCreatePost = async () => {
    try {
      setCreatingPost(true);
      const postData: CreateForumPostData = {
        title: newPostData.title,
        content: newPostData.content,
        category: newPostData.category,
        tags: newPostData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await apiClient.createForumPost(postData);
      if (response.success) {
        setShowNewPost(false);
        setNewPostData({ title: '', content: '', category: 'Stress & Anxiety', tags: '' });
        // Refresh posts
        await fetchForumPosts();
      } else {
        console.error('Failed to create post:', response.error);
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setCreatingPost(false);
    }
  };

  const handleSubmitReply = async () => {
    if (newReply.trim() && selectedPost) {
      try {
        setSubmittingReply(true);
        const commentData: CreateForumCommentData = {
          content: newReply
        };
        const response = await apiClient.addForumComment(selectedPost.id, commentData);
        if (response.success) {
          setNewReply('');
          // Refresh replies for this post
          await fetchPostReplies(selectedPost.id);
        } else {
          console.error('Failed to submit reply:', response.error);
        }
      } catch (err) {
        console.error('Error submitting reply:', err);
      } finally {
        setSubmittingReply(false);
      }
    }
  };

  const fetchPostReplies = async (postId: string) => {
    // For now, we'll use mock data since backend might not have replies endpoint
    // In a real implementation, you'd fetch replies from API
    const mockReplies = mockForumReplies.filter(reply => reply.postId === postId);
    setReplies(prev => [...prev.filter(r => r.postId !== postId), ...mockReplies]);
  };

  const postReplies = replies.filter(reply => reply.postId === selectedPost?.id);

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
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={creatingPost}
            >
              {creatingPost ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Tạo bài viết
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-md transition-shadow">
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
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-md transition-shadow">
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
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-md transition-shadow">
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
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-md transition-shadow">
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
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Đang tải bài viết...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <X className="h-8 w-8 mx-auto mb-4 text-red-500" />
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchForumPosts} variant="outline">
                Thử lại
              </Button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy bài viết nào
              </h3>
              <p className="text-gray-600">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all">
                      <AvatarImage src={post.authorAvatar} alt={post.author} />
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {post.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                            {post.isResolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
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
                          <div className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
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
            )))}
        </div>

        {filteredPosts.length === 0 && !loading && !error && (
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

      {/* Enhanced Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden p-0">
          {selectedPost && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3">
                  {selectedPost.isPinned && <Pin className="h-5 w-5 text-blue-600" />}
                  {selectedPost.isResolved && <CheckCircle className="h-5 w-5 text-green-600" />}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{selectedPost.title}</h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Avatar className="w-5 h-5">
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
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Post Content */}
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                      {selectedPost.content}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600 transition-colors">
                        <Heart className="h-4 w-4 mr-2" />
                        <span className="font-medium">{selectedPost.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="font-medium">{selectedPost.replies}</span>
                      </Button>
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{selectedPost.views} lượt xem</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Reply className="h-4 w-4 mr-2" />
                      Trả lời
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  {/* Replies Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Phản hồi ({postReplies.length})
                      </h4>
                      <Select defaultValue="newest">
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Mới nhất</SelectItem>
                          <SelectItem value="oldest">Cũ nhất</SelectItem>
                          <SelectItem value="popular">Phổ biến</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reply Form */}
                    <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50/30 to-white shadow-sm">
                      <Textarea
                        placeholder="Chia sẻ suy nghĩ của bạn về chủ đề này..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="mb-3 border-blue-200 focus:border-blue-400 min-h-[80px] resize-none"
                        rows={3}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Hãy thể hiện sự tôn trọng và chia sẻ những gì hữu ích với cộng đồng
                        </p>
                        <Button
                          size="sm"
                          onClick={handleSubmitReply}
                          disabled={!newReply.trim() || submittingReply}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                          {submittingReply ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            'Gửi phản hồi'
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Replies List */}
                    <div className="space-y-4">
                      {postReplies.map((reply) => (
                        <div key={reply.id} className="group hover:bg-blue-50/30 rounded-lg p-4 transition-colors border border-transparent hover:border-blue-100">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-9 h-9 ring-2 ring-blue-100">
                              <AvatarImage src={reply.authorAvatar} alt={reply.author} />
                              <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-sm text-gray-900">{reply.author}</span>
                                <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                                {reply.isAccepted && (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Câu trả lời hay
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{reply.content}</p>
                              <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 p-0 h-auto">
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                  <span className="text-xs">{reply.likes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 p-0 h-auto">
                                  <Reply className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Trả lời</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-0 h-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {postReplies.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có phản hồi nào. Hãy là người đầu tiên chia sẻ!</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Tạo bài viết mới</DialogTitle>
            <DialogDescription>
              Chia sẻ câu hỏi, kinh nghiệm hoặc thảo luận của bạn với cộng đồng
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
              <Input
                value={newPostData.title}
                onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
                placeholder="Nhập tiêu đề bài viết..."
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chủ đề *</label>
              <Select
                value={newPostData.category}
                onValueChange={(value) => setNewPostData({ ...newPostData, category: value })}
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
              <label className="block text-sm font-medium mb-2">Nội dung *</label>
              <Textarea
                value={newPostData.content}
                onChange={(e) => setNewPostData({ ...newPostData, content: e.target.value })}
                placeholder="Chia sẻ suy nghĩ, câu hỏi hoặc kinh nghiệm của bạn..."
                rows={8}
                className="border-blue-200 focus:border-blue-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <Input
                value={newPostData.tags}
                onChange={(e) => setNewPostData({ ...newPostData, tags: e.target.value })}
                placeholder="anxiety, stress, tips (phân cách bằng dấu phẩy)"
                className="border-blue-200 focus:border-blue-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Thêm tags để giúp người khác dễ dàng tìm thấy bài viết của bạn
              </p>
            </div>

            <div className="flex space-x-3 justify-end pt-4 border-t border-blue-100">
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Hủy
              </Button>
              <Button
                onClick={handleCreatePost}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newPostData.title.trim() || !newPostData.content.trim() || creatingPost}
              >
                {creatingPost ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  'Đăng bài'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
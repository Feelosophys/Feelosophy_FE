"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Search, 
  Heart, 
  Eye, 
  Clock, 
  Calendar,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Star,
  Share2,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  X,
  ExternalLink,
  Copy
} from 'lucide-react';
import { mockBlogArticles, blogCategories, BlogArticle } from '../data/forumBlogData';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const filteredArticles = mockBlogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'views':
        return b.views - a.views;
      case 'readTime':
        return a.readTime - b.readTime;
      default: // recent
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const featuredArticles = mockBlogArticles.filter(article => article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadTime = (minutes: number) => {
    return `${minutes} phút đọc`;
  };

  const handleShare = () => {
    if (navigator.share && selectedArticle) {
      navigator.share({
        title: selectedArticle.title,
        text: selectedArticle.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Tâm lý</h1>
          <p className="text-gray-600">
            Kiến thức chuyên môn và lời khuyên từ các chuyên gia tâm lý hàng đầu
          </p>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              Bài viết nổi bật
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <Card 
                  key={article.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 cursor-pointer group"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white shadow-lg">
                        {article.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8 ring-2 ring-blue-100">
                            <AvatarImage src={article.authorAvatar} alt={article.author} />
                            <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{article.author}</div>
                            <div className="text-xs text-gray-600">{article.authorTitle}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatReadTime(article.readTime)}
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {article.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
                {blogCategories.map(category => (
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
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="views">Nhiều lượt xem</SelectItem>
                <SelectItem value="readTime">Thời gian đọc</SelectItem>
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
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Card 
              key={article.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 cursor-pointer group"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {article.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 pt-2">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-600">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardContent className="px-6 pb-6 pt-0">
                <Separator className="mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={article.authorAvatar} alt={article.author} />
                      <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatReadTime(article.readTime)}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {article.views}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                    Đọc tiếp
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác
            </p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900">{mockBlogArticles.length}</div>
              <div className="text-sm text-blue-700">Bài viết chuyên môn</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-900">
                {mockBlogArticles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Lượt đọc tổng</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <Heart className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-900">
                {mockBlogArticles.reduce((sum, article) => sum + article.likes, 0)}
              </div>
              <div className="text-sm text-purple-700">Lượt yêu thích</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          {selectedArticle && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white shadow-lg">
                    {selectedArticle.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleBookmark}
                    className={`backdrop-blur-sm ${
                      isBookmarked 
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShare}
                    className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedArticle(null)}
                    className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl font-bold text-white mb-3 line-clamp-2">
                    {selectedArticle.title}
                  </h1>
                  <p className="text-lg text-gray-200 line-clamp-2">
                    {selectedArticle.excerpt}
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-8 space-y-8">
                  {/* Author & Meta Info */}
                  <div className="flex items-center justify-between py-4 border-y border-blue-100">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-14 h-14 ring-4 ring-blue-100">
                        <AvatarImage src={selectedArticle.authorAvatar} alt={selectedArticle.author} />
                        <AvatarFallback className="text-lg">{selectedArticle.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">{selectedArticle.author}</div>
                        <div className="text-sm text-blue-600 font-medium">{selectedArticle.authorTitle}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Chuyên gia tâm lý với 10+ năm kinh nghiệm
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8 text-sm text-gray-600">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                        </div>
                        <div className="font-medium">{formatDate(selectedArticle.publishedAt)}</div>
                        <div className="text-xs">Ngày đăng</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                        </div>
                        <div className="font-medium">{formatReadTime(selectedArticle.readTime)}</div>
                        <div className="text-xs">Thời gian đọc</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Eye className="h-4 w-4 mr-1" />
                        </div>
                        <div className="font-medium">{selectedArticle.views.toLocaleString()}</div>
                        <div className="text-xs">Lượt xem</div>
                      </div>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="prose max-w-none prose-lg">
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                      {selectedArticle.content}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-blue-100">
                    <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Article Actions */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={toggleLike}
                          className={`${
                            isLiked 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-gray-600 hover:text-red-600'
                          } transition-colors`}
                        >
                          <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                          <span className="font-medium">
                            {selectedArticle.likes + (isLiked ? 1 : 0)} Yêu thích
                          </span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleShare}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Share2 className="h-5 w-5 mr-2" />
                          <span className="font-medium">Chia sẻ</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-green-600 transition-colors"
                        >
                          <MessageSquare className="h-5 w-5 mr-2" />
                          <span className="font-medium">Bình luận</span>
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>98% độc giả thấy hữu ích</span>
                      </div>
                    </div>
                  </div>

                  {/* Related Articles */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                      Bài viết liên quan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockBlogArticles
                        .filter(article => 
                          article.id !== selectedArticle.id && 
                          (article.category === selectedArticle.category || 
                           article.tags.some(tag => selectedArticle.tags.includes(tag)))
                        )
                        .slice(0, 2)
                        .map((article) => (
                          <Card 
                            key={article.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-blue-100 hover:border-blue-200 group"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <CardContent className="p-4">
                              <div className="flex space-x-4">
                                <ImageWithFallback
                                  src={article.image}
                                  alt={article.title}
                                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="flex-1 space-y-2">
                                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {article.excerpt}
                                  </p>
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-2">
                                      <span>{article.author}</span>
                                      <span>•</span>
                                      <span>{formatReadTime(article.readTime)}</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="p-0 h-auto text-blue-600 hover:text-blue-700"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                    <div className="max-w-2xl mx-auto text-center">
                      <h3 className="text-xl font-bold mb-2">Đăng ký nhận bài viết mới</h3>
                      <p className="text-blue-100 mb-6">
                        Nhận những bài viết tâm lý hữu ích và mẹo chăm sóc sức khỏe tinh thần mỗi tuần
                      </p>
                      <div className="flex space-x-3 max-w-md mx-auto">
                        <Input 
                          placeholder="Nhập email của bạn"
                          className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                        />
                        <Button className="bg-white text-blue-600 hover:bg-gray-100">
                          Đăng ký
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
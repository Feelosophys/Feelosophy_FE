"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Settings,
  Users,
  TrendingUp,
  Eye,
  Copy
} from 'lucide-react';

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  duration: number; // in hours
  available: boolean;
  recurring?: boolean;
  recurringType?: 'weekly' | 'daily' | 'monthly';
  price?: number;
  isBooked?: boolean;
  patientName?: string;
}

interface ScheduleSettings {
  defaultDuration: number;
  defaultPrice: number;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  breakDuration: number;
  autoAcceptBookings: boolean;
  advanceBookingDays: number;
}

export function ScheduleManagementPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'week' | 'month'>('week');
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);

  // Mock time slots data
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      date: '2024-12-22',
      time: '09:00',
      duration: 1,
      available: true,
      price: 500000
    },
    {
      id: '2',
      date: '2024-12-22',
      time: '10:30',
      duration: 1,
      available: true,
      price: 500000
    },
    {
      id: '3',
      date: '2024-12-22',
      time: '14:00',
      duration: 2,
      available: false,
      price: 900000,
      isBooked: true,
      patientName: 'Nguyễn Văn A'
    },
    {
      id: '4',
      date: '2024-12-23',
      time: '09:00',
      duration: 1,
      available: true,
      recurring: true,
      recurringType: 'weekly',
      price: 500000
    },
    {
      id: '5',
      date: '2024-12-23',
      time: '15:00',
      duration: 1.5,
      available: true,
      price: 750000
    }
  ]);

  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    defaultDuration: 1,
    defaultPrice: 500000,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    breakDuration: 30,
    autoAcceptBookings: true,
    advanceBookingDays: 30
  });

  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    duration: 1,
    price: 500000,
    recurring: false,
    recurringType: 'weekly' as 'weekly' | 'daily' | 'monthly'
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const getTimeSlotsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return timeSlots.filter(slot => slot.date === dateString);
  };

  const handleAddSlot = () => {
    const id = Date.now().toString();
    const slot: TimeSlot = {
      id,
      date: newSlot.date,
      time: newSlot.time,
      duration: newSlot.duration,
      available: true,
      price: newSlot.price,
      recurring: newSlot.recurring,
      recurringType: newSlot.recurring ? newSlot.recurringType : undefined
    };

    setTimeSlots([...timeSlots, slot]);
    setNewSlot({
      date: '',
      time: '',
      duration: 1,
      price: 500000,
      recurring: false,
      recurringType: 'weekly'
    });
    setShowAddSlotDialog(false);
  };

  const handleDeleteSlot = (slotId: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
  };

  const handleToggleAvailability = (slotId: string) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === slotId 
        ? { ...slot, available: !slot.available }
        : slot
    ));
  };

  const handleQuickSetup = () => {
    const today = new Date();
    const newSlots: TimeSlot[] = [];
    
    // Generate slots for next 7 days based on working hours
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en', { weekday: 'lowercase' });
      
      if (scheduleSettings.workingDays.includes(dayName)) {
        const startHour = parseInt(scheduleSettings.workingHours.start.split(':')[0]);
        const endHour = parseInt(scheduleSettings.workingHours.end.split(':')[0]);
        
        for (let hour = startHour; hour < endHour; hour += scheduleSettings.defaultDuration) {
          const timeString = `${hour.toString().padStart(2, '0')}:00`;
          const id = `${date.toISOString().split('T')[0]}-${timeString}`;
          
          newSlots.push({
            id,
            date: date.toISOString().split('T')[0],
            time: timeString,
            duration: scheduleSettings.defaultDuration,
            available: true,
            price: scheduleSettings.defaultPrice
          });
        }
      }
    }
    
    setTimeSlots([...timeSlots, ...newSlots]);
  };

  const weekDates = getWeekDates(selectedDate);
  const totalSlots = timeSlots.length;
  const availableSlots = timeSlots.filter(slot => slot.available && !slot.isBooked).length;
  const bookedSlots = timeSlots.filter(slot => slot.isBooked).length;
  const revenue = timeSlots.filter(slot => slot.isBooked).reduce((sum, slot) => sum + (slot.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lịch trình</h1>
          <p className="text-gray-600">
            Quản lý thời gian rảnh và lịch hẹn với bệnh nhân
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-lg">{totalSlots}</div>
                  <div className="text-sm text-gray-600">Tổng khung giờ</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-bold text-lg">{availableSlots}</div>
                  <div className="text-sm text-gray-600">Còn trống</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-bold text-lg">{bookedSlots}</div>
                  <div className="text-sm text-gray-600">Đã đặt</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-bold text-lg">{formatPrice(revenue)}</div>
                  <div className="text-sm text-gray-600">Doanh thu</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm khung giờ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm khung giờ mới</DialogTitle>
                  <DialogDescription>
                    Tạo khung giờ tư vấn mới cho bệnh nhân
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Ngày</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newSlot.date}
                      onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Giờ</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newSlot.time}
                      onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Thời lượng (giờ)</Label>
                    <Select value={newSlot.duration.toString()} onValueChange={(value) => setNewSlot({...newSlot, duration: parseFloat(value)})}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">30 phút</SelectItem>
                        <SelectItem value="1">1 giờ</SelectItem>
                        <SelectItem value="1.5">1.5 giờ</SelectItem>
                        <SelectItem value="2">2 giờ</SelectItem>
                        <SelectItem value="3">3 giờ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Giá (VND)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newSlot.price}
                      onChange={(e) => setNewSlot({...newSlot, price: parseInt(e.target.value)})}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurring"
                      checked={newSlot.recurring}
                      onCheckedChange={(checked) => setNewSlot({...newSlot, recurring: checked})}
                    />
                    <Label htmlFor="recurring">Lặp lại định kỳ</Label>
                  </div>
                  
                  {newSlot.recurring && (
                    <div>
                      <Label htmlFor="recurringType">Loại lặp lại</Label>
                      <Select value={newSlot.recurringType} onValueChange={(value: 'weekly' | 'daily' | 'monthly') => setNewSlot({...newSlot, recurringType: value})}>
                        <SelectTrigger className="border-blue-200 focus:border-blue-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Hằng ngày</SelectItem>
                          <SelectItem value="weekly">Hằng tuần</SelectItem>
                          <SelectItem value="monthly">Hằng tháng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddSlotDialog(false)}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button 
                      onClick={handleAddSlot}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Thêm khung giờ
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={handleQuickSetup}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Thiết lập nhanh
            </Button>
            
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Cài đặt lịch trình</DialogTitle>
                  <DialogDescription>
                    Cấu hình mặc định cho lịch làm việc
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label>Thời lượng mặc định (giờ)</Label>
                    <Input
                      type="number"
                      value={scheduleSettings.defaultDuration}
                      onChange={(e) => setScheduleSettings({
                        ...scheduleSettings,
                        defaultDuration: parseFloat(e.target.value)
                      })}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  
                  <div>
                    <Label>Giá mặc định (VND)</Label>
                    <Input
                      type="number"
                      value={scheduleSettings.defaultPrice}
                      onChange={(e) => setScheduleSettings({
                        ...scheduleSettings,
                        defaultPrice: parseInt(e.target.value)
                      })}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  
                  <div>
                    <Label>Giờ làm việc</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="time"
                        value={scheduleSettings.workingHours.start}
                        onChange={(e) => setScheduleSettings({
                          ...scheduleSettings,
                          workingHours: { ...scheduleSettings.workingHours, start: e.target.value }
                        })}
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <Input
                        type="time"
                        value={scheduleSettings.workingHours.end}
                        onChange={(e) => setScheduleSettings({
                          ...scheduleSettings,
                          workingHours: { ...scheduleSettings.workingHours, end: e.target.value }
                        })}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={scheduleSettings.autoAcceptBookings}
                      onCheckedChange={(checked) => setScheduleSettings({
                        ...scheduleSettings,
                        autoAcceptBookings: checked
                      })}
                    />
                    <Label>Tự động chấp nhận đặt lịch</Label>
                  </div>
                  
                  <Button 
                    onClick={() => setShowSettingsDialog(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Lưu cài đặt
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={currentView} onValueChange={(value: 'week' | 'month') => setCurrentView(value)}>
              <SelectTrigger className="w-32 border-blue-200 focus:border-blue-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar View */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Lịch</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border-0"
                  classNames={{
                    months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                    month: "space-y-4 w-full flex flex-col",
                    table: "w-full h-full border-collapse space-y-1",
                    head_row: "flex w-full",
                    head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] text-center",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                    day: "h-8 w-full p-0 font-normal aria-selected:opacity-100 text-center rounded-md hover:bg-accent hover:text-accent-foreground",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                  }}
                />
                
                <Separator className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Còn trống</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Đã đặt</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Không khả dụng</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Grid */}
          <div className="lg:col-span-3">
            {currentView === 'week' ? (
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    <span>Lịch tuần</span>
                  </CardTitle>
                  <CardDescription>
                    {formatDate(weekDates[0].toISOString().split('T')[0])} - {formatDate(weekDates[6].toISOString().split('T')[0])}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date, index) => {
                      const daySlots = getTimeSlotsForDate(date);
                      const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
                      
                      return (
                        <div key={index} className="border border-blue-100 rounded-lg p-2 min-h-[200px]">
                          <div className="text-center mb-2">
                            <div className="font-medium text-sm">{dayName}</div>
                            <div className="text-xs text-gray-600">{date.getDate()}</div>
                          </div>
                          
                          <div className="space-y-1">
                            {daySlots.map((slot) => (
                              <div
                                key={slot.id}
                                className={`p-2 rounded text-xs cursor-pointer hover:shadow-sm transition-all ${
                                  slot.isBooked
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : slot.available
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}
                                onClick={() => setEditingSlot(slot)}
                              >
                                <div className="font-medium">{slot.time}</div>
                                <div className="text-xs opacity-75">
                                  {slot.duration}h - {formatPrice(slot.price || 0)}
                                </div>
                                {slot.isBooked && (
                                  <div className="text-xs mt-1 font-medium">
                                    {slot.patientName}
                                  </div>
                                )}
                                {slot.recurring && (
                                  <div className="flex items-center mt-1">
                                    <RefreshCw className="h-2 w-2 mr-1" />
                                    <span className="text-xs">Lặp lại</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    <span>Lịch tháng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chế độ xem tháng đang được phát triển</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Edit Slot Dialog */}
        {editingSlot && (
          <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chi tiết khung giờ</DialogTitle>
                <DialogDescription>
                  {formatDate(editingSlot.date)} - {editingSlot.time}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Thời lượng:</span>
                    <div className="font-medium">{editingSlot.duration} giờ</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Giá:</span>
                    <div className="font-medium">{formatPrice(editingSlot.price || 0)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Trạng thái:</span>
                    <div>
                      <Badge className={
                        editingSlot.isBooked
                          ? 'bg-blue-100 text-blue-800'
                          : editingSlot.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }>
                        {editingSlot.isBooked ? 'Đã đặt' : editingSlot.available ? 'Còn trống' : 'Không khả dụng'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Lặp lại:</span>
                    <div className="font-medium">
                      {editingSlot.recurring ? `Có (${editingSlot.recurringType})` : 'Không'}
                    </div>
                  </div>
                </div>
                
                {editingSlot.isBooked && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Thông tin bệnh nhân</h4>
                    <p className="text-blue-800">{editingSlot.patientName}</p>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex space-x-2">
                  {!editingSlot.isBooked && (
                    <Button
                      variant="outline"
                      onClick={() => handleToggleAvailability(editingSlot.id)}
                      className="flex-1"
                    >
                      {editingSlot.available ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Đánh dấu không khả dụng
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Đánh dấu khả dụng
                        </>
                      )}
                    </Button>
                  )}
                  
                  {!editingSlot.isBooked && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDeleteSlot(editingSlot.id);
                        setEditingSlot(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  )}
                  
                  {editingSlot.isBooked && (
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Xem chi tiết đặt lịch
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
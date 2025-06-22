"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { 
  Star, 
  Clock, 
  Users, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  User,
} from 'lucide-react';
import { Expert, TimeSlot } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CalendarBookingProps {
  expert: Expert;
  onClose: () => void;
}

export function CalendarBooking({ expert, onClose }: CalendarBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [duration, setDuration] = useState<number>(1);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const durationOptions = [
    { value: 1, label: '1 giờ', description: 'Tư vấn cơ bản', discount: 0 },
    { value: 2, label: '2 giờ', description: 'Tư vấn chi tiết', discount: 0.05 },
    { value: 3, label: '3 giờ', description: 'Tư vấn chuyên sâu', discount: 0.1 },
    { value: 4, label: '4 giờ', description: 'Tư vấn toàn diện', discount: 0.15 }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDateForKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeSlot = (time: string) => {
    return time;
  };

  const calculateTotalPrice = () => {
    const basePrice = expert.price * duration;
    const discount = durationOptions.find(d => d.value === duration)?.discount || 0;
    return basePrice * (1 - discount);
  };

  const calculateDiscount = () => {
    const basePrice = expert.price * duration;
    const discount = durationOptions.find(d => d.value === duration)?.discount || 0;
    return basePrice * discount;
  };

  // Group availability by date
  const availabilityByDate = expert.availability.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  // Check if date has available slots
  const isDateAvailable = (date: Date) => {
    const dateKey = formatDateForKey(date);
    const slots = availabilityByDate[dateKey];
    return slots && slots.some(slot => slot.available);
  };

  // Get time slots for selected date
  const getTimeSlotsForDate = (date: Date) => {
    const dateKey = formatDateForKey(date);
    return availabilityByDate[dateKey] || [];
  };

  const selectedDateSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };

  const handleSlotSelection = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingDialog(true);
  };

  const handleBooking = () => {
    // Simulate booking process
    setTimeout(() => {
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingDialog(false);
        setBookingSuccess(false);
        setSelectedSlot(null);
        setSelectedDate(undefined);
        setDuration(1);
        onClose();
      }, 2000);
    }, 1500);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <span>Đặt lịch tư vấn</span>
        </DialogTitle>
        <DialogDescription>
          Chọn ngày và thời gian phù hợp để đặt lịch tư vấn với chuyên gia
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 max-w-full overflow-hidden">
        {/* Expert Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="relative flex-shrink-0">
                <ImageWithFallback
                  src={expert.image}
                  alt={expert.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl text-gray-900 truncate">{expert.name}</CardTitle>
                <CardDescription className="text-blue-700 font-medium text-base">
                  {expert.title}
                </CardDescription>
                <div className="flex items-center space-x-4 text-sm mt-2 flex-wrap">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{expert.rating}</span>
                    <span className="text-gray-600">({expert.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{expert.experience} năm</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>1.2k+ tư vấn</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  {formatPrice(expert.price)}
                </div>
                <div className="text-sm text-gray-600">/ giờ</div>
                <Badge className="mt-1 bg-green-100 text-green-700 border-green-200 text-xs">
                  Đang hoạt động
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Chuyên môn:</h4>
                <div className="flex flex-wrap gap-1">
                  {expert.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Giới thiệu:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{expert.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Duration Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Chọn thời lượng tư vấn</span>
          </h3>
          <RadioGroup value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {durationOptions.map((option) => (
                <div key={option.value} className="relative">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`duration-${option.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`duration-${option.value}`}
                    className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-900 transition-all duration-200"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-base">{option.label}</div>
                      <div className="text-sm text-gray-600">
                        {option.description}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="font-bold text-blue-600 text-lg">
                        {formatPrice(expert.price * option.value * (1 - option.discount))}
                      </div>
                      {option.discount > 0 && (
                        <div className="text-xs">
                          <span className="line-through text-gray-400">
                            {formatPrice(expert.price * option.value)}
                          </span>
                          <span className="text-green-600 font-medium ml-1">
                            -{Math.round(option.discount * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Calendar and Time Selection */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-1 xl:grid-cols-2 lg:gap-6">
          {/* Calendar */}
          <div className="order-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <span>Chọn ngày</span>
            </h3>
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today || !isDateAvailable(date);
                    }}
                    className="w-full"
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
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span className="text-gray-600">Ngày đã chọn</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent rounded"></div>
                    <span className="text-gray-600">Hôm nay</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <span className="text-gray-600">Không có lịch</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Slots */}
          <div className="order-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Chọn giờ</span>
            </h3>
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {selectedDate 
                    ? formatDateDisplay(selectedDate)
                    : 'Vui lòng chọn ngày'
                  }
                </CardTitle>
                {selectedDate && (
                  <CardDescription>
                    {selectedDateSlots.filter(slot => slot.available).length} khung giờ trống
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  selectedDateSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedDateSlots.map((slot, index) => (
                        <Button
                          key={index}
                          variant={slot.available ? "outline" : "secondary"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => {
                            if (slot.available) {
                              handleSlotSelection(slot);
                            }
                          }}
                          className={`h-10 text-sm font-medium transition-all duration-200 ${
                            slot.available 
                              ? 'hover:bg-blue-600 hover:text-white border-blue-200 hover:border-blue-600' 
                              : 'opacity-50 cursor-not-allowed bg-gray-100'
                          }`}
                        >
                          {formatTimeSlot(slot.time)}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Không có khung giờ nào trong ngày này</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Chọn ngày để xem khung giờ trống</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Price Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-lg text-gray-900">Tổng chi phí tư vấn</div>
                  <div className="text-sm text-gray-600">
                    {duration} giờ × {formatPrice(expert.price)}
                    {calculateDiscount() > 0 && (
                      <span className="text-green-600 ml-2">
                        (Giảm {formatPrice(calculateDiscount())})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {calculateDiscount() > 0 && (
                    <div className="text-lg line-through text-gray-400">
                      {formatPrice(expert.price * duration)}
                    </div>
                  )}
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">
                    {formatPrice(calculateTotalPrice())}
                  </div>
                </div>
              </div>
              
              {selectedDate && selectedSlot && (
                <div className="pt-3 border-t border-blue-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ngày hẹn:</span>
                      <div className="font-medium">{formatDateDisplay(selectedDate)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Thời gian:</span>
                      <div className="font-medium">
                        {selectedSlot.time} - {
                          new Date(new Date(`${selectedSlot.date} ${selectedSlot.time}:00`).getTime() + (duration * 60 * 60 * 1000))
                            .toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {bookingSuccess ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span>Đặt lịch thành công!</span>
                </>
              ) : (
                <>
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                  <span>Xác nhận đặt lịch</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {bookingSuccess 
                ? 'Lịch tư vấn của bạn đã được đặt thành công! Chúng tôi sẽ gửi email xác nhận trong vài phút.'
                : 'Kiểm tra lại thông tin và xác nhận đặt lịch tư vấn với chuyên gia'
              }
            </DialogDescription>
          </DialogHeader>
          
          {!bookingSuccess ? (
            <div className="space-y-6">
              <Card className="border-blue-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Chi tiết đặt lịch</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="col-span-1 text-gray-600">Chuyên gia:</div>
                    <div className="col-span-2 font-medium">{expert.name}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="col-span-1 text-gray-600">Ngày:</div>
                    <div className="col-span-2 font-medium">
                      {selectedSlot && formatDateDisplay(new Date(selectedSlot.date))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="col-span-1 text-gray-600">Thời gian:</div>
                    <div className="col-span-2 font-medium">
                      {selectedSlot?.time} - {
                        selectedSlot && 
                        new Date(new Date(`${selectedSlot.date} ${selectedSlot.time}:00`).getTime() + (duration * 60 * 60 * 1000))
                          .toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="col-span-1 text-gray-600">Thời lượng:</div>
                    <div className="col-span-2 font-medium">{duration} giờ</div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="col-span-1 text-gray-600">Đơn giá:</div>
                      <div className="col-span-2">{formatPrice(expert.price)}/giờ</div>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="col-span-1 text-gray-600">Giảm giá:</div>
                        <div className="col-span-2 text-green-600">-{formatPrice(calculateDiscount())}</div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4 text-base border-t pt-2">
                      <div className="col-span-1 font-medium">Tổng cộng:</div>
                      <div className="col-span-2 font-bold text-blue-600 text-xl">
                        {formatPrice(calculateTotalPrice())}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex space-x-3 justify-end">
                <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                  Hủy bỏ
                </Button>
                <Button onClick={handleBooking} className="bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xác nhận đặt lịch
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                <div className="space-y-2">
                  <p className="text-green-600 font-semibold text-lg">
                    Đặt lịch thành công!
                  </p>
                  <p className="text-gray-600">
                    Chúng tôi sẽ gửi email xác nhận và link tham gia buổi tư vấn.
                  </p>
                </div>
              </div>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Tổng chi phí:</span>
                      <span className="font-bold">{formatPrice(calculateTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời lượng:</span>
                      <span className="font-medium">{duration} giờ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chuyên gia:</span>
                      <span className="font-medium">{expert.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
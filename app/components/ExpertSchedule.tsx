import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Star, Clock, CheckCircle} from 'lucide-react';
import { Expert, TimeSlot } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ExpertScheduleProps {
  expert: Expert;
  onClose: () => void;
}

export function ExpertSchedule({ expert, onClose }: ExpertScheduleProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [duration, setDuration] = useState<number>(1);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const durationOptions = [
    { value: 1, label: '1 giờ', description: 'Tư vấn cơ bản' },
    { value: 2, label: '2 giờ', description: 'Tư vấn chi tiết' },
    { value: 3, label: '3 giờ', description: 'Tư vấn chuyên sâu' },
    { value: 4, label: '4 giờ', description: 'Tư vấn toàn diện' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateTotalPrice = () => {
    return expert.price * duration;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupedSlots = expert.availability.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleBooking = () => {
    // Simulate booking process
    setTimeout(() => {
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingDialog(false);
        setBookingSuccess(false);
        setSelectedSlot(null);
        setDuration(1);
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleSlotSelection = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingDialog(true);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Đặt lịch tư vấn</DialogTitle>
        <DialogDescription>
          Chọn thời gian và thời lượng phù hợp để đặt lịch tư vấn với chuyên gia
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Expert Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start space-x-4">
              <ImageWithFallback
                src={expert.image}
                alt={expert.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <CardTitle className="text-xl">{expert.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {expert.title}
                </CardDescription>
                <div className="flex items-center space-x-1 text-sm mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{expert.rating}</span>
                  <span className="text-gray-600">({expert.reviews} đánh giá)</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4" />
                  <span>{expert.experience} năm kinh nghiệm</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(expert.price)}
                </div>
                <div className="text-sm text-gray-600">mỗi giờ</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium">Chuyên môn:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {expert.specialization.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Giới thiệu:</h4>
                <p className="text-sm text-gray-600 mt-1">{expert.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Duration Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Chọn thời lượng tư vấn</h3>
          <RadioGroup value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {durationOptions.map((option) => (
                <div key={option.value} className="relative">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`duration-${option.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`duration-${option.value}`}
                    className="flex items-center justify-between p-4 border border-blue-200 rounded-lg cursor-pointer hover:border-blue-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-900 transition-all"
                  >
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600 peer-checked:text-blue-700">
                        {option.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {formatPrice(expert.price * option.value)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {option.value > 1 && (
                          <span className="text-green-600">
                            Tiết kiệm {formatPrice(expert.price * option.value * 0.05)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Schedule */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Chọn thời gian bắt đầu</h3>
          <div className="space-y-4">
            {Object.entries(groupedSlots).map(([date, slots]) => (
              <Card key={date} className="border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {formatDate(date)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {slots.map((slot, index) => (
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
                        className={`${
                          slot.available 
                            ? 'hover:bg-blue-600 hover:text-white border-blue-200' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-300 rounded"></div>
            <span>Khung giờ trống</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>Đã được đặt</span>
          </div>
        </div>

        {/* Price Summary */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Tổng chi phí tư vấn</div>
                <div className="text-sm text-gray-600">
                  {duration} giờ × {formatPrice(expert.price)}
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatPrice(calculateTotalPrice())}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {bookingSuccess ? 'Đặt lịch thành công!' : 'Xác nhận đặt lịch'}
            </DialogTitle>
            <DialogDescription>
              {bookingSuccess 
                ? 'Lịch tư vấn của bạn đã được đặt thành công!'
                : 'Bạn có chắc chắn muốn đặt lịch tư vấn này không?'
              }
            </DialogDescription>
          </DialogHeader>
          
          {!bookingSuccess ? (
            <div className="space-y-4">
              <Card className="border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Chi tiết đặt lịch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Chuyên gia:</span>
                    <span className="font-medium">{expert.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày:</span>
                    <span className="font-medium">
                      {selectedSlot && formatDate(selectedSlot.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giờ bắt đầu:</span>
                    <span className="font-medium">{selectedSlot?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời lượng:</span>
                    <span className="font-medium">{duration} giờ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giờ kết thúc:</span>
                    <span className="font-medium">
                      {selectedSlot && 
                        new Date(`${selectedSlot.date} ${selectedSlot.time}:00`)
                          .getTime() + (duration * 60 * 60 * 1000) > 0 &&
                        new Date(new Date(`${selectedSlot.date} ${selectedSlot.time}:00`).getTime() + (duration * 60 * 60 * 1000))
                          .toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                      }
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Đơn giá:</span>
                    <span>{formatPrice(expert.price)}/giờ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng phí tư vấn:</span>
                    <span className="font-bold text-primary text-lg">
                      {formatPrice(calculateTotalPrice())}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={handleBooking} className="bg-blue-600 hover:bg-blue-700">
                  Xác nhận đặt lịch
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-green-600 font-medium">
                  Đặt lịch thành công!
                </p>
                <p className="text-sm text-gray-600">
                  Chúng tôi sẽ gửi email xác nhận và link tham gia buổi tư vấn {duration} giờ.
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm">
                    <div><strong>Tổng chi phí:</strong> {formatPrice(calculateTotalPrice())}</div>
                    <div><strong>Thời lượng:</strong> {duration} giờ</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
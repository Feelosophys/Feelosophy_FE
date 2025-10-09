"use client"

import { useState, useMemo } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { Calendar } from "./ui/calendar"
import { ScrollArea } from "./ui/scroll-area"
import { Progress } from "./ui/progress"
import {
  Star,
  Clock,
  Users,
  CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Video,
  Phone,
  CreditCard,
  Shield,
  Gift,
  Zap,
  Award,
  Mail,
  MessageSquare,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import type { TimeSlot, Expert } from "../types"
import { apiClient } from "../../lib/api"

interface CalendarBookingProps {
  expert: Expert
  onClose: () => void
}

export function CalendarBooking({ expert, onClose }: CalendarBookingProps) {
  const getInitialMonth = () => {
    if (expert.availability.length > 0) {
      // Get the first available date from availability data
      const firstAvailableDate = expert.availability[0].date
      const [year, month] = firstAvailableDate.split("-").map(Number)
      return new Date(year, month - 1, 1) // month - 1 because JS months are 0-indexed
    }
    return new Date() // Fallback to current date if no availability
  }

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [duration, setDuration] = useState<number>(1)
  const [consultationType, setConsultationType] = useState<string>("online")
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(getInitialMonth())
  const [bookingStep, setBookingStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const consultationTypes = [
    {
      id: "online",
      label: "Tư vấn trực tuyến",
      description: "Video call qua Zoom/Meet",
      icon: Video,
      discount: 0,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: "inperson",
      label: "Tư vấn trực tiếp",
      description: "Tại phòng khám",
      icon: MapPin,
      discount: 0,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: "phone",
      label: "Tư vấn qua điện thoại",
      description: "Cuộc gọi voice",
      icon: Phone,
      discount: 0.1,
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  ]

  const durationOptions = [
    {
      value: 1,
      label: "1 giờ",
      description: "Tư vấn cơ bản",
      discount: 0,
      icon: Clock,
      popular: false,
    },
    {
      value: 2,
      label: "2 giờ",
      description: "Tư vấn chi tiết",
      discount: 0.05,
      icon: Zap,
      popular: true,
    },
    {
      value: 3,
      label: "3 giờ",
      description: "Tư vấn chuyên sâu",
      discount: 0.1,
      icon: Award,
      popular: false,
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDateForKey = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateTotalPrice = () => {
    const selectedConsultationType = consultationTypes.find((t) => t.id === consultationType)
    const selectedDuration = durationOptions.find((d) => d.value === duration)

    const basePrice = expert.price * duration
    const consultationDiscount = selectedConsultationType?.discount || 0
    const durationDiscount = selectedDuration?.discount || 0
    const totalDiscount = Math.max(consultationDiscount, durationDiscount)

    return basePrice * (1 - totalDiscount)
  }

  const calculateSavings = () => {
    const basePrice = expert.price * duration
    return basePrice - calculateTotalPrice()
  }

  // Group availability by date
  const availabilityByDate = expert.availability.reduce(
    (acc, slot) => {
      const date = slot.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(slot)
      return acc
    },
    {} as Record<string, TimeSlot[]>,
  )

  // Check if date has available slots
  const isDateAvailable = (date: Date) => {
    const dateKey = formatDateForKey(date)
    const slots = availabilityByDate[dateKey]
    return slots && slots.some((slot) => slot.available)
  }

  // Get time slots for selected date
  const getTimeSlotsForDate = (date: Date) => {
    const dateKey = formatDateForKey(date)
    const slots = availabilityByDate[dateKey] || []
    return slots
  }

  const selectedDateSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : []

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date)
      setSelectedSlot(null)
    }
  }

  const handleSlotSelection = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setShowBookingDialog(true)
    setBookingStep(1)
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !consultationType) {
      console.error("Missing required booking information");
      alert("Vui lòng chọn đầy đủ thông tin để đặt lịch.");
      return;
    }
  
    // Kiểm tra tính hợp lệ của workingHourId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(selectedSlot.id);
    if (!isValidObjectId) {
      console.error("Invalid workingHourId:", selectedSlot.id);
      alert("Lỗi: ID khung giờ không hợp lệ. Vui lòng thử lại.");
      setIsProcessing(false);
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const bookingData = {
        workingHourId: selectedSlot.id,
        duration: duration,
        consultationType: consultationType as "online" | "inperson" | "phone",
      };
  
      console.log("[v0] Booking data:", bookingData);
  
      const response = await apiClient.bookAppointment(bookingData);
  
      if (response.success) {
        setBookingStep(2);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBookingStep(3);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBookingSuccess(true);
  
        setTimeout(() => {
          setShowBookingDialog(false);
          setBookingSuccess(false);
          setSelectedSlot(null);
          setSelectedDate(undefined);
          setDuration(1);
          setBookingStep(1);
          setIsProcessing(false);
          onClose();
        }, 3000);
      } else {
        console.error("Booking failed:", response.error || "Unknown error");
        alert(response.error || "Đặt lịch thất bại. Vui lòng thử lại.");
        setShowBookingDialog(false);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Đã có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
      setShowBookingDialog(false);
      setIsProcessing(false);
    }
  };

  const getStepTitle = () => {
    switch (bookingStep) {
      case 1:
        return "Xác nhận thông tin"
      case 2:
        return "Đang xử lý thanh toán"
      case 3:
        return "Đang tạo lịch hẹn"
      default:
        return "Đặt lịch thành công"
    }
  }

  const canProceed = selectedDate && selectedSlot && duration && consultationType

  const hasFutureAvailability = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return expert.availability.some((slot) => {
      const slotDate = new Date(slot.date)
      slotDate.setHours(0, 0, 0, 0)
      return slotDate >= today && slot.available
    })
  }, [expert.availability])

  return (
    <>
      <DialogHeader className="border-b border-blue-100 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-2xl flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <span>Đặt lịch tư vấn</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-base">
              Chọn thời gian và hình thức tư vấn phù hợp với bạn
            </DialogDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </DialogHeader>

      <ScrollArea className="max-h-[calc(85vh-12rem)]">
        <div className="space-y-8 py-1 px-1">
          {/* Expert Showcase Card */}
          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={expert.image || "/placeholder.svg"}
                    alt={expert.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 bg-yellow-400 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <Sparkles className="h-4 w-4 text-yellow-800" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{expert.name}</h3>
                      <p className="text-lg text-blue-700 font-semibold mb-2">{expert.title}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{expert.rating}</span>
                          <span className="text-gray-600">({expert.reviews} đánh giá)</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{expert.experience} năm kinh nghiệm</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>1.2k+ tư vấn</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-700 border-green-200 mb-2">Đang hoạt động</Badge>
                      <div className="text-3xl font-bold text-blue-600">{formatPrice(expert.price)}</div>
                      <div className="text-sm text-gray-600">/ giờ</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {expert.specialization.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{expert.bio}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!hasFutureAvailability && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <CalendarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-yellow-900 mb-2">Chuyên gia chưa cập nhật lịch mới</h3>
                    <p className="text-sm text-yellow-800 mb-4">
                      Hiện tại chuyên gia chưa có lịch trống trong tương lai. Tất cả các khung giờ hiện có đã qua ngày{" "}
                      {new Date().toLocaleDateString("vi-VN")}.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-yellow-50 border-yellow-300"
                        onClick={() => {
                          // TODO: Implement contact expert functionality
                          alert("Tính năng liên hệ chuyên gia đang được phát triển")
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Liên hệ chuyên gia
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-yellow-50 border-yellow-300"
                        onClick={onClose}
                      >
                        Chọn chuyên gia khác
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consultation Type Selection */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Video className="h-5 w-5 text-blue-600" />
              <span>Hình thức tư vấn</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consultationTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div key={type.id} className="relative w-full h-40">
                    <input
                      type="radio"
                      value={type.id}
                      id={`type-${type.id}`}
                      checked={consultationType === type.id}
                      onChange={() => setConsultationType(type.id)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`type-${type.id}`}
                      className={`flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all duration-200 ${type.color} w-full h-full justify-center z-10`}
                    >
                      <div className={`p-3 rounded-full mb-3 ${type.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-base mb-1">{type.label}</div>
                        <div className="text-sm text-gray-600 mb-2">{type.description}</div>
                        {type.discount > 0 && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            <Gift className="h-3 w-3 mr-1" />
                            Giảm {Math.round(type.discount * 100)}%
                          </Badge>
                        )}
                      </div>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Thời lượng tư vấn</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {durationOptions.map((option) => {
                const Icon = option.icon
                const totalPrice = expert.price * option.value
                const discountAmount = totalPrice * option.discount
                const finalPrice = totalPrice - discountAmount

                return (
                  <div key={option.value} className="relative w-full h-56">
                    <input
                      type="radio"
                      value={option.value.toString()}
                      id={`duration-${option.value}`}
                      checked={duration === option.value}
                      onChange={() => setDuration(option.value)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`duration-${option.value}`}
                      className="flex flex-col p-6 border-2 border-blue-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-900 transition-all duration-200 relative overflow-hidden w-full h-full z-10"
                    >
                      {option.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                          PHỔ BIẾN
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Giá:</span>
                          <div className="text-right">
                            {option.discount > 0 && (
                              <div className="text-sm line-through text-gray-400">{formatPrice(totalPrice)}</div>
                            )}
                            <div className="font-bold text-blue-600 text-lg">{formatPrice(finalPrice)}</div>
                          </div>
                        </div>
                        {option.discount > 0 && (
                          <div className="flex items-center justify-center">
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                              <Gift className="h-3 w-3 mr-1" />
                              Tiết kiệm {formatPrice(discountAmount)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Calendar and Time Selection */}
          <div className="space-y-8">
            {/* Calendar */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <span>Chọn ngày</span>
                {!hasFutureAvailability && (
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50">
                    Không có lịch mới
                  </Badge>
                )}
              </h3>
              <Card className="border-blue-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">
                      {currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
                    </h4>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-center">
                    <div className="w-full max-w-lg">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today || !isDateAvailable(date)
                        }}
                        className="rounded-md border p-4 text-lg"
                        classNames={{
                          months: "space-y-4",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-lg font-medium",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.9rem]",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 hover:rounded-full transition-all duration-200",
                          day_selected:
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_disabled: "text-muted-foreground opacity-50",
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span className="text-gray-600">Ngày đã chọn</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-accent rounded"></div>
                      <span className="text-gray-600">Hôm nay</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-100 rounded"></div>
                      <span className="text-gray-600">Có lịch trống</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <span className="text-gray-600">Không có lịch</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Slots */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Chọn giờ</span>
              </h3>
              <Card className="border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    {selectedDate ? formatDateDisplay(selectedDate) : "Chọn ngày để xem khung giờ"}
                  </CardTitle>
                  {selectedDate && (
                    <CardDescription className="flex items-center space-x-4">
                      <span>{selectedDateSlots.filter((slot) => slot.available).length} khung giờ trống</span>
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        Phản hồi trong 5 phút
                      </Badge>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    selectedDateSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedDateSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant={slot.available ? "outline" : "secondary"}
                            size="sm"
                            disabled={!slot.available}
                            onClick={() => {
                              if (slot.available) {
                                handleSlotSelection(slot)
                              }
                            }}
                            className={`h-12 text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                              slot.available
                                ? "hover:bg-blue-600 hover:text-white border-blue-200 hover:border-blue-600 hover:shadow-lg transform hover:scale-105"
                                : "opacity-50 cursor-not-allowed bg-gray-100"
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span>{slot.time}</span>
                              {slot.available && <span className="text-xs opacity-75">Còn trống</span>}
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Không có khung giờ nào</p>
                        <p className="text-sm">Vui lòng chọn ngày khác</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Chọn ngày trước</p>
                      <p className="text-sm">để xem khung giờ trống</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Price Summary & Book Button */}
          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Tổng chi phí</h4>
                    <div className="text-sm text-gray-600">
                      {duration} giờ × {formatPrice(expert.price)}
                      {calculateSavings() > 0 && (
                        <span className="text-green-600 ml-2 font-medium">
                          (Tiết kiệm {formatPrice(calculateSavings())})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {calculateSavings() > 0 && (
                      <div className="text-lg line-through text-gray-400">{formatPrice(expert.price * duration)}</div>
                    )}
                    <div className="text-3xl font-bold text-blue-600">{formatPrice(calculateTotalPrice())}</div>
                  </div>
                </div>

                {selectedDate && selectedSlot && (
                  <div className="pt-3 border-t border-blue-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Ngày:</span>
                        <div className="font-medium">{formatDateDisplay(selectedDate)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Giờ:</span>
                        <div className="font-medium">{selectedSlot.time}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Hình thức:</span>
                        <div className="font-medium">
                          {consultationTypes.find((t) => t.id === consultationType)?.label}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (canProceed) {
                      setShowBookingDialog(true)
                    }
                  }}
                  disabled={!canProceed}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {!canProceed ? (
                    "Vui lòng chọn đầy đủ thông tin"
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Đặt lịch ngay - {formatPrice(calculateTotalPrice())}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Bảo mật 100%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Xác nhận tức thì</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{getStepTitle()}</DialogTitle>
            <DialogDescription>
              {bookingSuccess ? "Đặt lịch thành công!" : "Vui lòng chờ trong giây lát..."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {!bookingSuccess ? (
              <>
                <div className="text-center space-y-4">
                  <Progress value={(bookingStep / 3) * 100} className="w-full" />
                  <div className="text-sm text-gray-600">
                    Bước {bookingStep}/3: {getStepTitle()}
                  </div>
                </div>

                {bookingStep === 1 && selectedDate && selectedSlot && (
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Chuyên gia:</span>
                        <span className="font-medium">{expert.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ngày:</span>
                        <span className="font-medium">{formatDateDisplay(selectedDate)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Giờ:</span>
                        <span className="font-medium">{selectedSlot.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Thời lượng:</span>
                        <span className="font-medium">{duration} giờ</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Hình thức:</span>
                        <span className="font-medium">
                          {consultationTypes.find((t) => t.id === consultationType)?.label}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-blue-600">{formatPrice(calculateTotalPrice())}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowBookingDialog(false)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {bookingStep === 1 ? "Xác nhận đặt lịch" : "Đang xử lý..."}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-green-600 mb-2">Đặt lịch thành công!</h3>
                  <p className="text-sm text-gray-600">
                    Chúng tôi đã gửi email xác nhận đến bạn. Chuyên gia sẽ liên hệ trong vòng 24h.
                  </p>
                </div>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email xác nhận</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span>SMS nhắc nhở</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarIcon, CheckCircle, Clock, AlertCircle } from "lucide-react"

import { apiClient } from "../../lib/api"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Textarea } from "./ui/textarea"

interface BookingSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}

interface BookingExpert {
  id: string
  name: string
  price: number
  user: {
    id?: string
    _id?: string
    name: string
    email: string
  }
  workingSlots: BookingSlot[]
}

interface CalendarBookingProps {
  expert: BookingExpert
  onClose: () => void
  initialSlotId?: string
}

const formatCurrency = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price)

const buildSlotDate = (slot: BookingSlot) => {
  const slotDate = new Date(slot.date)
  if (Number.isNaN(slotDate.getTime())) {
    return new Date()
  }

  const [hour, minute] = slot.startTime.split(":").map(Number)
  slotDate.setHours(hour || 0, minute || 0, 0, 0)
  return slotDate
}

const formatDateLabel = (isoDate: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate))

const formatTimeRange = (slot: BookingSlot) => `${slot.startTime} - ${slot.endTime}`

export function CalendarBooking({ expert, onClose, initialSlotId }: CalendarBookingProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(initialSlotId ?? null)
  const [notes, setNotes] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [bookedSlotIds, setBookedSlotIds] = useState<string[]>([])
  const teacherIdentifier = expert.user.id ?? expert.user._id ?? expert.id

  useEffect(() => {
    setSelectedSlotId(initialSlotId ?? null)
  }, [initialSlotId])

  const groupedSlots = useMemo(() => {
    const now = new Date()
    const result = new Map<
      string,
      {
        label: string
        slots: Array<{
          data: BookingSlot
          disabled: boolean
        }>
      }
    >()

    const futureSlots = expert.workingSlots.filter((slot) => buildSlotDate(slot) > now)
    const sorted = futureSlots.sort((a, b) => buildSlotDate(a).getTime() - buildSlotDate(b).getTime())

    sorted.forEach((slot) => {
      const key = slot.date.split("T")[0]
      const label = formatDateLabel(slot.date)
      const disabled = slot.isBooked || bookedSlotIds.includes(slot.id)

      if (!result.has(key)) {
        result.set(key, {
          label,
          slots: [],
        })
      }

      result.get(key)!.slots.push({ data: slot, disabled })
    })

    return Array.from(result.entries()).map(([key, value]) => ({
      key,
      label: value.label,
      slots: value.slots,
    }))
  }, [expert.workingSlots, bookedSlotIds])

  const selectedSlot = useMemo(
    () => expert.workingSlots.find((slot) => slot.id === selectedSlotId) ?? null,
    [expert.workingSlots, selectedSlotId],
  )

  const availableSlotCount = useMemo(() => {
    const now = new Date()
    return expert.workingSlots.filter(
      (slot) => !slot.isBooked && !bookedSlotIds.includes(slot.id) && buildSlotDate(slot) > now,
    ).length
  }, [expert.workingSlots, bookedSlotIds])

  const handleSelectSlot = (slot: BookingSlot, disabled: boolean) => {
    if (disabled) return
    setSelectedSlotId(slot.id)
    setError(null)
    setSuccess(false)
  }

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setError("Vui lòng chọn khung giờ trước khi đặt lịch.")
      return
    }

    setIsBooking(true)
    setError(null)

    if (!teacherIdentifier) {
      setError("Không tìm thấy thông tin chuyên gia. Vui lòng tải lại trang và thử lại.")
      setIsBooking(false)
      return
    }

    try {
      const response = await apiClient.bookAppointment({
        teacherId: teacherIdentifier,
        workingHourId: selectedSlot.id,
        notes: notes.trim() ? notes.trim() : undefined,
      })

      if (response.success) {
        setSuccess(true)
        setBookedSlotIds((prev) => [...prev, selectedSlot.id])
        setTimeout(() => {
          onClose()
        }, 1200)
      } else {
        setError(response.error || "Đặt lịch thất bại. Vui lòng thử lại.")
      }
    } catch (bookingError) {
      console.error("Booking error:", bookingError)
      setError("Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại.")
    } finally {
      setIsBooking(false)
    }
  }

  const selectedSlotDateLabel = selectedSlot ? formatDateLabel(selectedSlot.date) : ""
  const selectedSlotTimeLabel = selectedSlot ? formatTimeRange(selectedSlot) : ""

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Khung giờ làm việc</span>
              <Badge variant="outline" className="border-blue-200 text-blue-600">
                {availableSlotCount} khung giờ trống
              </Badge>
            </CardTitle>
            <CardDescription>
              Chọn khung giờ phù hợp với chuyên gia {expert.name} để đặt lịch tư vấn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[420px] pr-4">
              {groupedSlots.length === 0 ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Hiện chưa có khung giờ khả dụng.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedSlots.map((day) => (
                    <div key={day.key} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                        <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">{day.label}</h3>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {day.slots.map(({ data, disabled }) => (
                          <Button
                            key={data.id}
                            variant={selectedSlotId === data.id ? "default" : "outline"}
                            className={`justify-between border-blue-200 text-sm transition-all ${
                              selectedSlotId === data.id
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "hover:bg-blue-50"
                            }`}
                            disabled={disabled || isBooking}
                            onClick={() => handleSelectSlot(data, disabled)}
                          >
                            <span className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatTimeRange(data)}</span>
                            </span>
                            <Badge variant="secondary" className="bg-white/70 text-blue-600">
                              {disabled ? "Không khả dụng" : "Còn trống"}
                            </Badge>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Xác nhận đặt lịch</CardTitle>
            <CardDescription>
              Kiểm tra thông tin và thêm ghi chú trước khi xác nhận đặt lịch tư vấn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSlot ? (
              <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Thời gian đã chọn</p>
                    <p className="text-base font-semibold text-blue-700">
                      {selectedSlotDateLabel} · {selectedSlotTimeLabel}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-blue-200 text-blue-600">
                    {formatCurrency(expert.price)} / buổi
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-600">
                Vui lòng chọn một khung giờ ở danh sách bên trái.
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <label htmlFor="booking-notes" className="text-sm font-medium text-gray-700">
                Ghi chú (tuỳ chọn)
              </label>
              <Textarea
                id="booking-notes"
                placeholder="Ví dụ: Chủ đề muốn trao đổi, thông tin cần lưu ý..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span>Đặt lịch thành công! Cảm ơn bạn đã tin tưởng chuyên gia {expert.name}.</span>
              </div>
            )}

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!selectedSlot || isBooking}
              onClick={handleBookAppointment}
            >
              {isBooking ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
            </Button>

            <Button variant="ghost" className="w-full" onClick={onClose} disabled={isBooking}>
              Huỷ bỏ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

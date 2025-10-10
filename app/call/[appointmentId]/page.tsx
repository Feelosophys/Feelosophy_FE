"use client"

import { use, useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function AppointmentCallPage({ params }: { params: Promise<{ appointmentId: string }> }) {
  const resolvedParams = use(params)
  const { appointmentId } = resolvedParams
  const containerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const callConfig = useMemo(() => {
    const roomId = searchParams.get("roomId")?.trim()
    const token = searchParams.get("token")?.trim()
    const userId = searchParams.get("userId")?.trim()
    const userName = searchParams.get("userName")?.trim() || userId || "Guest"
    const serverUrl = searchParams.get("serverUrl")?.trim()
    return {
      roomId,
      token,
      userId,
      userName,
      serverUrl,
    }
  }, [searchParams])

  useEffect(() => {
    if (typeof document !== "undefined") {
      const participant = callConfig.userName ? ` với ${callConfig.userName}` : ""
      document.title = `Cuộc gọi tư vấn${participant}`
    }
  }, [callConfig.userName])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const { roomId, token, userId } = callConfig

    if (!roomId || !token || !userId) {
      setError("Thiếu thông tin tham gia phòng. Vui lòng quay lại và thử lại.")
      return
    }

    let isCancelled = false
    let kitInstance: { destroy: () => void } | null = null

    const startCall = async () => {
      try {
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt")

        if (isCancelled || !containerRef.current) {
          return
        }

        const instance = ZegoUIKitPrebuilt.create(token)
        kitInstance = instance

        instance.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: `Phòng ${appointmentId}`,
              url: typeof window !== "undefined" ? window.location.href : "",
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
          showPreJoinView: false,
          layout: "Auto",
          onLeaveRoom: () => {
            router.back()
          },
        })
      } catch (callError) {
        console.error("Failed to start Zego call:", callError)
        if (!isCancelled) {
          setError("Không thể khởi tạo phòng Zego. Vui lòng thử lại sau.")
        }
      }
    }

    startCall()

    return () => {
      isCancelled = true
      if (kitInstance) {
        kitInstance.destroy()
      }
    }
  }, [appointmentId, callConfig, router])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-50">
        <div className="max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6 text-center shadow-xl">
          <h1 className="text-xl font-semibold">Không thể tham gia cuộc gọi</h1>
          <p className="mt-2 text-sm text-slate-300">{error}</p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  return <div ref={containerRef} className="min-h-screen w-full bg-black" />
}

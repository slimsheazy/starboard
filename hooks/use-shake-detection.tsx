"use client"

import { useEffect, useState } from "react"

interface ShakeDetectionOptions {
  threshold?: number // Acceleration threshold for shake detection
  debounceTime?: number // Time in ms to debounce shake events
}

export function useShakeDetection(onShake: () => void, enabled = true, options?: ShakeDetectionOptions) {
  const { threshold = 15, debounceTime = 500 } = options || {}
  const [lastShakeTime, setLastShakeTime] = useState(0)

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      return
    }

    let lastX = 0,
      lastY = 0,
      lastZ = 0

    const handleMotionEvent = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity

      if (!acceleration || !acceleration.x || !acceleration.y || !acceleration.z) {
        return
      }

      const curTime = Date.now()

      if (curTime - lastShakeTime > debounceTime) {
        const deltaX = Math.abs(acceleration.x - lastX)
        const deltaY = Math.abs(acceleration.y - lastY)
        const deltaZ = Math.abs(acceleration.z - lastZ)

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
          onShake()
          setLastShakeTime(curTime)
        }
      }

      lastX = acceleration.x
      lastY = acceleration.y
      lastZ = acceleration.z
    }

    window.addEventListener("devicemotion", handleMotionEvent)

    return () => {
      window.removeEventListener("devicemotion", handleMotionEvent)
    }
  }, [onShake, enabled, threshold, debounceTime, lastShakeTime])
}

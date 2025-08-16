"use client"

import { useEffect, useState } from "react"

// Threshold for shake detection
const SHAKE_THRESHOLD = 15

export default function useShakeDetection(onShake: () => void, enabled = true) {
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)
  const [lastZ, setLastZ] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(0)
  const [cooldown, setCooldown] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Check if device motion is available
    if (!window.DeviceMotionEvent) {
      console.log("Device motion not supported")
      return
    }

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = Date.now()
      const timeDiff = current - lastUpdate

      // Only process if enough time has passed
      if (timeDiff > 100) {
        const acceleration = event.accelerationIncludingGravity

        if (!acceleration || acceleration.x === null) return

        const x = acceleration.x || 0
        const y = acceleration.y || 0
        const z = acceleration.z || 0

        const deltaX = Math.abs(lastX - x)
        const deltaY = Math.abs(lastY - y)
        const deltaZ = Math.abs(lastZ - z)

        // Check if motion exceeds threshold
        if (
          (deltaX > SHAKE_THRESHOLD && deltaY > SHAKE_THRESHOLD) ||
          (deltaX > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD) ||
          (deltaY > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD)
        ) {
          if (!cooldown) {
            onShake()
            setCooldown(true)

            // Prevent multiple triggers
            setTimeout(() => {
              setCooldown(false)
            }, 2000)
          }
        }

        setLastX(x)
        setLastY(y)
        setLastZ(z)
        setLastUpdate(current)
      }
    }

    window.addEventListener("devicemotion", handleMotion)

    return () => {
      window.removeEventListener("devicemotion", handleMotion)
    }
  }, [lastUpdate, lastX, lastY, lastZ, onShake, cooldown, enabled])
}

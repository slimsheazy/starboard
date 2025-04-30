"use client"

import { useRef, useEffect, useState } from "react"
import type { House } from "@/lib/types"

interface AstrologyWheelProps {
  houses: House[]
}

export default function AstrologyWheel({ houses }: AstrologyWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)

  useEffect(() => {
    const updateSize = () => {
      if (wheelRef.current) {
        setSize(wheelRef.current.offsetWidth)
      }
    }

    // Initial size
    updateSize()

    // Update size on resize
    window.addEventListener("resize", updateSize)

    return () => {
      window.removeEventListener("resize", updateSize)
    }
  }, [])

  const innerRadius = size * 0.15
  const outerRadius = size * 0.5
  // Position labels slightly more inward from the outer circle
  const labelRadius = size * 0.42 // Adjusted slightly inward from 0.45

  return (
    <div ref={wheelRef} className="absolute inset-0 w-full h-full">
      <div className="relative w-full h-full">
        {/* Outer circle */}
        <div className="absolute inset-0 border border-white/30 rounded-full" />
        {/* Inner circle */}
        <div className="absolute inset-[15%] border border-white/20 rounded-full" />

        {/* House divisions */}
        {houses.map((house, index) => {
          // Adjust angle to rotate 15 degrees counterclockwise
          const angle = 180 + index * -30
          const labelAngle = angle - 15 // Rotate labels 15 degrees counterclockwise

          const radians = (angle * Math.PI) / 180
          const labelRadians = (labelAngle * Math.PI) / 180

          const numberRadius = size * 0.55 // Adjusted for better visibility
          const nameRadius = size * 0.6 // Adjusted for better visibility

          // Line coordinates
          const lineStartX = size / 2 + innerRadius * Math.cos(radians)
          const lineStartY = size / 2 + innerRadius * Math.sin(radians)
          const lineEndX = size / 2 + outerRadius * Math.cos(radians)
          const lineEndY = size / 2 + outerRadius * Math.sin(radians)

          // Use contextual keyword if available, otherwise use the default keyword
          const displayKeyword = house.contextKeyword || house.keyword

          return (
            <div key={house.number} className="absolute inset-0">
              {/* House divider line */}
              <svg className="absolute inset-0 w-full h-full">
                <line
                  x1={lineStartX}
                  y1={lineStartY}
                  x2={lineEndX}
                  y2={lineEndY}
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                />
              </svg>

              {/* House keyword - positioned slightly more inward and rotated */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-[10px] md:text-xs text-white/90 text-center font-light z-10"
                style={{
                  left: size / 2 + labelRadius * Math.cos(labelRadians),
                  top: size / 2 + labelRadius * Math.sin(labelRadians),
                  maxWidth: "70px",
                }}
              >
                {displayKeyword}
              </div>

              {/* House name (hidden on mobile) */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-[8px] text-white/40 text-center hidden md:block z-10"
                style={{
                  left: size / 2 + nameRadius * Math.cos(radians),
                  top: size / 2 + nameRadius * Math.sin(radians),
                  maxWidth: "70px",
                }}
              >
                {house.name}
              </div>

              {/* House number */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-[10px] text-white/60 font-medium z-10"
                style={{
                  left: size / 2 + numberRadius * Math.cos(radians),
                  top: size / 2 + numberRadius * Math.sin(radians),
                }}
              >
                {house.number}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

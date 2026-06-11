export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded bg-purple-600"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 12 12"
          fill="none"
        >
          <rect
            x="1"
            y="1"
            width="4"
            height="4"
            rx="1"
            fill="white"
            fillOpacity=".9"
          />
          <rect
            x="7"
            y="1"
            width="4"
            height="4"
            rx="1"
            fill="white"
            fillOpacity=".55"
          />
          <rect
            x="1"
            y="7"
            width="4"
            height="4"
            rx="1"
            fill="white"
            fillOpacity=".55"
          />
          <rect
            x="7"
            y="7"
            width="4"
            height="4"
            rx="1"
            fill="white"
            fillOpacity=".25"
          />
        </svg>
      </div>
      <span className="text-text text-md font-sans font-medium">TaskFlow</span>
    </div>
  )
}

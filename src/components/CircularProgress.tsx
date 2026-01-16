import { motion } from 'framer-motion'

interface CircularProgressProps {
  percentage: number
  color: string
  size?: number
  strokeWidth?: number
  isOvertime?: boolean
}

export function CircularProgress({
  percentage,
  color,
  size = 400,
  strokeWidth = 12,
  isOvertime = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-secondary"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        initial={false}
        animate={{
          strokeDashoffset: offset,
        }}
        transition={{
          duration: 0.1,
          ease: 'linear',
        }}
        style={{
          transform: isOvertime ? 'scaleX(-1)' : 'none',
          transformOrigin: 'center',
        }}
      />
    </svg>
  )
}

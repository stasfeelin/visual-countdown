import { motion } from 'framer-motion'

interface CircularProgressProps {
  percentage: number
  color: string
  size?: number
  strokeWidth?: number
  isOvertime?: boolean
  overtimePercentage?: number
}

export function CircularProgress({
  percentage,
  color,
  size = 400,
  strokeWidth = 12,
  isOvertime = false,
  overtimePercentage = 0,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  const normalOffset = circumference - (percentage / 100) * circumference
  const selectedColorOffset = circumference
  const redOffset = circumference - (overtimePercentage / 100) * circumference

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
      
      {!isOvertime ? (
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={normalOffset}
          strokeLinecap="round"
          initial={false}
          animate={{
            strokeDashoffset: normalOffset,
          }}
          transition={{
            duration: 1,
            ease: 'linear',
          }}
        />
      ) : (
        <>
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={selectedColorOffset}
            strokeLinecap="round"
            initial={false}
            animate={{
              strokeDashoffset: selectedColorOffset,
            }}
            transition={{
              duration: 1,
              ease: 'linear',
            }}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="oklch(0.6 0.25 25)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={redOffset}
            strokeLinecap="round"
            initial={false}
            animate={{
              strokeDashoffset: redOffset,
            }}
            transition={{
              duration: 1,
              ease: 'linear',
            }}
          />
        </>
      )}
    </svg>
  )
}

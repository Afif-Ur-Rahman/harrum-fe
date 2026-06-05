'use client'

import { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Text } from '@radix-ui/themes'

type CountdownProps = {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownTimer = ({ targetDate }: CountdownProps) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const target = new Date(targetDate)
    const now = new Date()
    const difference = target.getTime() - now.getTime()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }, [targetDate])

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return (
    <Flex align="center" gap="2">
      {timeLeft.days > 0 && (
        <>
          <TimeBox value={timeLeft.days} label="Days" />
          <Text weight="bold">:</Text>
        </>
      )}
      <TimeBox value={timeLeft.hours} label="Hrs" />
      <Text weight="bold">:</Text>
      <TimeBox value={timeLeft.minutes} label="Min" />
      <Text weight="bold">:</Text>
      <TimeBox value={timeLeft.seconds} label="Sec" />
    </Flex>
  )
}

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <Box className="flex min-w-18.75 items-center rounded-md border border-[#F2AE40] px-2 py-1">
    <Text weight="bold" size="5">
      {String(value).padStart(2, '0')}
    </Text>
    <Text size="2" className="ml-1">
      {label}
    </Text>
  </Box>
)

export default CountdownTimer

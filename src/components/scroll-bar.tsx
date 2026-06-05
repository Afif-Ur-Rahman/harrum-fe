'use client'

import React from 'react'
import { Flex, FlexProps } from '@radix-ui/themes'
import { cn } from '@/utils'

export type ScrollBarProps = FlexProps & {
  children: React.ReactNode
  className?: string
}

const ScrollBar = ({ children, className = '', ...rest }: ScrollBarProps) => {
  return (
    <Flex
      className={cn(
        'scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent overflow-x-auto',
        'scrollbar-corner-transparent',
        '[&::-webkit-scrollbar-button]:hidden',
        '[&::-webkit-scrollbar-corner]:hidden',
        className
      )}
      style={{ 
        scrollbarGutter: 'stable',
        scrollbarWidth: 'thin',
        ...rest.style 
      }}
      {...rest}
    >
      {children}
    </Flex>
  )
}

export { ScrollBar }

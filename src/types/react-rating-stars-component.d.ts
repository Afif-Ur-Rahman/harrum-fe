declare module 'react-rating-stars-component' {
  import * as React from 'react'

  interface ReactStarsProps {
    count?: number
    value?: number
    size?: number
    isHalf?: boolean
    onChange?: (newRating: number) => void
    activeColor?: string
    color?: string
    edit?: boolean
  }

  const ReactStars: React.FC<ReactStarsProps>

  export default ReactStars
}

import { FC, ReactNode } from 'react'

export interface Carousel3dProps {
  className?: string | string[] | { [className: string]: boolean }
  children?: ReactNode
  autoplay?: boolean
}

export const Carousel3d: FC<Carousel3dProps> = (props) => {
  return (
    <div>
      Carousel3d
    </div>
  )
}

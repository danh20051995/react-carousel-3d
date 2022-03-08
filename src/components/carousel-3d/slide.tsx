import { FC, ReactNode } from 'react'

export interface SlideProps {
  className?: string | string[] | { [className: string]: boolean }
  children?: ReactNode
}

export const Slide: FC<SlideProps> = (props) => {
  return (
    <div>
      Slide
    </div>
  )
}

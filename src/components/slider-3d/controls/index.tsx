import { FC, MouseEventHandler, ReactNode, useMemo } from 'react'
import clsx from 'clsx'
import Styles from './s.m.scss'

export interface ControlsProps {
  className?: string | string[] | { [className: string]: boolean }
  children?: ReactNode
  width?: number
  height?: number
  prevHtml?: string
  nextHtml?: string
  goPrev?: MouseEventHandler<HTMLAnchorElement>
  isPrevPossible?: boolean
  goNext?: MouseEventHandler<HTMLAnchorElement>
  isNextPossible?: boolean
}

export const Controls: FC<ControlsProps> = ({
  width = 50,
  height = 60,
  prevHtml = '&lsaquo;',
  nextHtml = '&rsaquo;',
  isPrevPossible = true,
  isNextPossible = true,
  ...props
}) => {
  const styles = useMemo(() => ({
    width: `${width}px`,
    height: `${height}px`,
    lineHeight: `${height}px`
  }), [height, width])

  return (
    <div className={Styles.slider3dControls}>
      <a
        aria-label="Previous slide"
        className={clsx(Styles.prev, { [Styles.disabled]: !isPrevPossible })}
        href="#"
        onClick={props.goPrev}
        style={styles}
      >
        <span dangerouslySetInnerHTML={{ __html: prevHtml }}></span>
      </a>

      <a
        aria-label="Next slide"
        className={clsx(Styles.next, { [Styles.disabled]: !isNextPossible })}
        href="#"
        onClick={props.goNext}
        style={styles}
      >
        <span dangerouslySetInnerHTML={{ __html: nextHtml }}></span>
      </a>
    </div>
  )
}

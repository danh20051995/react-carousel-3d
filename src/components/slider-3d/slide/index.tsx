import clsx from 'clsx'
import { FC, MouseEvent as RMouseEvent, MouseEventHandler, ReactNode, useCallback, useMemo, useState } from 'react'
import Styles from './s.m.scss'

export interface SlideProps {
  className?: string | string[] | { [className: string]: boolean }
  children?: ReactNode
  index?: number
  currentIndex?: number
  total?: number
  isActive?: boolean
  clickable?: boolean
  animationSpeed?: number
  disable3d?: boolean
  hasHiddenSlides?: boolean
  inverseScaling?: number
  leftOutIndex?: number
  leftIndices?: number[]
  rightOutIndex?: number
  rightIndices?: number[]
  oneDirectional?: boolean
  perspective?: number
  slideHeight?: number
  slideWidth?: number
  border?: number
  width?: number
  space?: number | string
  goTo?: (index: number) => any
  onMainSlideClick?: (event: RMouseEvent<Element, MouseEvent>, index: number) => any
}

export const Slide: FC<SlideProps> = (props) => {
  const [zIndex] = useState(999)
  const {
    index = 0,
    currentIndex = 0,
    total = 0,
    isActive = false,
    clickable = true,
    animationSpeed = 500,
    disable3d = false,
    hasHiddenSlides = false,
    inverseScaling = 300,
    leftOutIndex = 0,
    leftIndices = [],
    rightOutIndex = 0,
    rightIndices = [],
    oneDirectional = false,
    perspective = 35,
    space = 'auto',
    slideHeight = 1,
    slideWidth = 1,
    border = 1,
    width = 360
    // ..._props
  } = props

  const goToSlide = useCallback<MouseEventHandler>((event) => {
    if (isActive) {
      return typeof props.onMainSlideClick === 'function' && props.onMainSlideClick(event, index)
    }

    if (clickable) {
      typeof props.goTo === 'function' && props.goTo(index)
    }
  }, [index, isActive, clickable, props])

  const calculatePosition = useCallback((i, positive, zIndex) => {
    const z = !disable3d ? inverseScaling + ((i + 1) * 100) : 0
    const y = !disable3d ? perspective : 0
    const leftRemain = typeof space === 'string'
      ? (i + 1) * (width / 1.5)
      : (i + 1) * space
    const transform = (positive)
      ? 'translateX(' + (leftRemain) + 'px) translateZ(-' + z + 'px) ' +
      'rotateY(-' + y + 'deg)'
      : 'translateX(-' + (leftRemain) + 'px) translateZ(-' + z + 'px) ' +
      'rotateY(' + y + 'deg)'
    const top = typeof space === 'string' ? 0 : (i + 1) * space

    return {
      transform,
      top,
      zIndex: zIndex - Math.abs(i) + 1
    }
  }, [disable3d, inverseScaling, perspective, width, space])

  const matchIndex = useCallback((i: number) => {
    return i >= 0
      ? index === i
      : (total + i) === index
  }, [index, total])

  const getSideIndex = useCallback((indices: number[]) => {
    for (let i = 0; i < indices.length; i++) {
      if (matchIndex(indices[i])) {
        return i
      }
    }

    return -1
  }, [matchIndex])

  const leftIndex = useMemo(() => {
    if (oneDirectional && getSideIndex(leftIndices) > currentIndex - 1) {
      return -1
    }
    return getSideIndex(leftIndices)
  }, [currentIndex, getSideIndex, leftIndices, oneDirectional])

  const rightIndex = useMemo(() => {
    if (oneDirectional && getSideIndex(rightIndices) > total - currentIndex - 2) {
      return -1
    }
    return getSideIndex(rightIndices)
  }, [currentIndex, getSideIndex, rightIndices, oneDirectional, total])

  const slideStyle = useMemo(() => {
    let styles: { [key: string]: string | number } = {}

    if (!isActive) {
      if (rightIndex >= 0 || leftIndex >= 0) {
        styles = rightIndex >= 0
          ? calculatePosition(rightIndex, true, zIndex)
          : calculatePosition(leftIndex, false, zIndex)
        styles.opacity = 1
        styles.visibility = 'visible'
      }

      if (hasHiddenSlides) {
        styles = matchIndex(leftOutIndex)
          ? calculatePosition(leftIndices.length - 1, false, zIndex)
          : matchIndex(rightOutIndex)
            ? calculatePosition(rightIndices.length - 1, true, zIndex)
            : styles
      }
    }

    return Object.assign(styles, {
      borderWidth: `${border}px`,
      width: `${slideWidth}px`,
      height: `${slideHeight}px`,
      transition: `transform ${animationSpeed}ms, opacity ${animationSpeed}ms, visibility ${animationSpeed}ms`
    })
  }, [
    animationSpeed,
    border,
    calculatePosition,
    hasHiddenSlides,
    isActive,
    leftIndex,
    leftIndices,
    leftOutIndex,
    matchIndex,
    rightIndex,
    rightIndices,
    rightOutIndex,
    slideHeight,
    slideWidth,
    zIndex
  ])

  const computedClasses = useMemo(() => ({
    [`left-${leftIndex + 1}`]: leftIndex >= 0,
    [`right-${rightIndex + 1}`]: rightIndex >= 0,
    [Styles.current]: isActive
  }), [isActive, leftIndex, rightIndex])

  return (
    <div
      className={clsx(Styles.slider3dSlide, computedClasses)}
      style={slideStyle}
      onClick={goToSlide}
    >
      {props.children}
    </div>
  )
}

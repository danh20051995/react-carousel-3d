import { FC, MouseEvent as RMouseEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Controls } from './controls'
import { Slide, SlideProps } from './slide'
import { useDidMountEffect } from '../../hooks/useDidMountEffect'

/**
 * Calculate slide with and keep defined aspect ratio
 */
const calculateAspectRatio = (width: number, height: number) => width / height

export enum EDirection {
  LTR = 'ltr',
  RTL = 'rtl',
}

export enum EBias {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface Slider3DProps {
  items: string[] | ReactNode[]
  className?: string | string[] | { [className: string]: boolean }

  autoplay?: boolean
  autoplayTimeout?: number
  autoplayHoverPause?: boolean
  autoplayDirection?: EDirection,

  controlsHeight?: number
  controlsNextHtml?: string
  controlsPrevHtml?: string
  controlsVisible?: boolean
  controlsWidth?: number

  animationSpeed?: number
  bias?: EBias
  clickable?: boolean
  disable3d?: boolean
  loop?: boolean
  oneDirectional?: boolean
  reverse?: boolean
  startIndex?: number
  minSwipeDistance?: number
  display?: number
  border?: number
  width?: number
  height?: number
  space?: number | string
  perspective?: number
  inverseScaling?: number

  onLastSlide?: (index: number) => any
  onBeforeSlideChange?: (index: number) => any
  onSlideChange?: (index: number) => any
  onMainSlideClick?: (event: RMouseEvent<Element, MouseEvent>, index: number) => any
}

export const Slider3D: FC<Slider3DProps> = (props) => {
  const {
    autoplay = false,
    autoplayTimeout = 2000,
    autoplayHoverPause = false,
    autoplayDirection = EDirection.LTR,

    controlsHeight = 50,
    controlsNextHtml = '&rsaquo;',
    controlsPrevHtml = '&lsaquo;',
    controlsVisible = false,
    controlsWidth = 50,

    animationSpeed = 500,
    bias = EBias.LEFT,
    clickable = false,
    disable3d = false,
    loop = false,
    oneDirectional = false,
    reverse = false,
    startIndex = 0,
    minSwipeDistance = 10,
    display = 5,
    border = 1,
    width = 360,
    height = 270,
    space = 'auto',
    perspective = 35,
    inverseScaling = 300
    // ..._props
  } = props

  const ref = useRef<HTMLDivElement>(null)
  const autoplayTimeOutRef = useRef<NodeJS.Timer>()
  const [viewport, setViewport] = useState(0)
  const [walkStep, setWalkStep] = useState(0)
  const [state, setState] = useState({
    currentIndex: Math.min(
      Math.max(0, startIndex),
      props.items.length - 1
    ),
    total: props.items.length,
    mousedown: false,
    dragStartX: 0,
    dragStartY: 0
  })

  const { isFirstSlide, isLastSlide } = useMemo(
    () => ({
      isFirstSlide: !reverse
        ? state.currentIndex === 0
        : state.currentIndex === state.total - 1,
      isLastSlide: reverse
        ? state.currentIndex === 0
        : state.currentIndex === state.total - 1
    }),
    [state.currentIndex, state.total, reverse]
  )

  const isNextPossible = useMemo(
    () => loop || !isLastSlide,
    [loop, isLastSlide]
  )

  const isPrevPossible = useMemo(
    () => loop || !isFirstSlide,
    [loop, isFirstSlide]
  )

  const slideWidth = useMemo(() => {
    const vw = viewport
    const sw = width + (border * 2)
    return Math.min(vw, sw)
  }, [viewport, width, border])

  const slideHeight = useMemo(() => {
    const sw = width + (border * 2)
    const sh = height + (border * 2)
    const ar = calculateAspectRatio(sw, sh)
    return slideWidth / ar
  }, [slideWidth, width, height, border])

  const visible = useMemo(
    () => Math.min(display, state.total),
    [display, state.total]
  )

  const hasHiddenSlides = useMemo(
    () => state.total > visible,
    [visible, state.total]
  )

  const leftIndices = useMemo(() => {
    let n = (visible - 1) / 2
    n = bias.toLowerCase() === EBias.LEFT
      ? Math.ceil(n)
      : Math.floor(n)

    const indices = []
    for (let m = 1; m <= n; m++) {
      const index = (
        reverse
          ? state.currentIndex + m
          : state.currentIndex - m
      ) % state.total

      const result = index < 0
        ? state.total + index
        : index

      indices.push(result)
    }

    return indices
  }, [state.currentIndex, state.total, visible, bias, reverse])

  const rightIndices = useMemo(() => {
    let n = (visible - 1) / 2

    n = bias.toLowerCase() === EBias.RIGHT
      ? Math.ceil(n)
      : Math.floor(n)

    const indices = []
    for (let m = 1; m <= n; m++) {
      const index = (
        !reverse
          ? state.currentIndex + m
          : state.currentIndex - m
      ) % state.total

      const result = index < 0
        ? state.total + index
        : index

      indices.push(result)
    }

    return indices
  }, [state.currentIndex, state.total, visible, bias, reverse])

  const leftOutIndex = useMemo(() => {
    let n = (visible - 1) / 2
    n = 1 + (
      bias.toLowerCase() === EBias.LEFT
        ? Math.ceil(n)
        : Math.floor(n)
    )

    if (reverse) {
      return (state.total - state.currentIndex - n) <= 0
        ? -(state.total - state.currentIndex - n)
        : state.currentIndex + n
    }

    return (state.currentIndex - n)
  }, [state.currentIndex, state.total, visible, bias, reverse])

  const rightOutIndex = useMemo(() => {
    let n = (visible - 1) / 2

    n = 1 + (
      bias.toLowerCase() === EBias.RIGHT
        ? Math.ceil(n)
        : Math.floor(n)
    )

    if (reverse) {
      return state.currentIndex - n
    }

    return (state.total - state.currentIndex - n) <= 0
      ? -(state.total - state.currentIndex - n)
      : state.currentIndex + n
  }, [state.currentIndex, state.total, visible, bias, reverse])

  /**
   * SECTION: methods
   */

  /**
   * Go to slide
   */
  const goSlide = useCallback((index: number) => {
    const toIndex = Math.min(
      state.total,
      Math.max(0, index)
    )

    if (isLastSlide) {
      props.onLastSlide && props.onLastSlide(state.currentIndex)
    }

    props.onBeforeSlideChange && props.onBeforeSlideChange(toIndex)

    setState(prev => ({
      ...prev,
      currentIndex: toIndex
    }))
  }, [state.total, state.currentIndex, isLastSlide, props])

  /**
   * Go to previous slide
   */
  const goPrev = useCallback(() => {
    if (isPrevPossible) {
      goSlide(
        isFirstSlide
          ? reverse
            ? 0
            : state.total - 1
          : reverse
            ? state.currentIndex + 1
            : state.currentIndex - 1
      )
    }
  }, [reverse, state.currentIndex, state.total, isPrevPossible, isFirstSlide, goSlide])

  /**
   * Go to next slide
   */
  const goNext = useCallback(() => {
    if (isNextPossible) {
      goSlide(
        isLastSlide
          ? reverse
            ? state.total - 1
            : 0
          : reverse
            ? state.currentIndex - 1
            : state.currentIndex + 1
      )
    }
  }, [reverse, state.currentIndex, state.total, isNextPossible, isLastSlide, goSlide])

  /**
   * Go to a far slide with steps animation
   */
  const animateToSlide = useCallback((index: number) => {
    if (state.currentIndex === index) {
      return
    }

    if (!loop) {
      return setWalkStep(() => (reverse ? -1 : 1) * (index - state.currentIndex))
    }

    if (leftIndices.includes(index)) {
      return setWalkStep(() => - 1 - leftIndices.indexOf(index))
    }

    return setWalkStep(() => 1 + rightIndices.indexOf(index))
  }, [state.currentIndex, reverse, loop, leftIndices, rightIndices])

  /**
   * Watch walkStep effect
   * Step by step to slide
   */
  useDidMountEffect(() => {
    if (!walkStep) {
      return
    }

    const walkDelay = animationSpeed / Math.abs(walkStep)
    const walkDirection = walkStep < 0 ? EDirection.RTL : EDirection.LTR
    const walk = (step = 0) => setTimeout(() => {
      if (step++ === Math.abs(walkStep)) {
        return setWalkStep(() => 0)
      }

      setState(prev => {
        const prevIndex = (prev.currentIndex - 1) < 0
          ? prev.total - 1
          : prev.currentIndex - 1

        const nextIndex = (prev.currentIndex + 1) > (prev.total - 1)
          ? 0
          : prev.currentIndex + 1

        return {
          ...prev,
          currentIndex: walkDirection === EDirection.RTL
            ? reverse
              ? nextIndex
              : prevIndex
            : reverse
              ? prevIndex
              : nextIndex
        }
      })

      // continue walking
      walk(step)
    }, step ? walkDelay : 0)

    // start walking
    const timeout = walk()
    return () => clearTimeout(timeout)
  }, [walkStep])

  /**
   * Trigger event after slide change
   */
  useDidMountEffect(() => {
    props.onSlideChange && props.onSlideChange(state.currentIndex)
  }, [state.currentIndex])

  /**
   * attach | detach mouse/touch event handlers
   */
  useEffect(() => {
    if (!ref.current) {
      return
    }

    /**
     * Trigger actions when mouse is released
     */
    const handleMouseup = () => {
      return setState( prev => ({
        ...prev,
        mousedown: false
      }))
    }

    /**
     * Trigger actions when mouse is pressed
     */
    const handleMousedown = (e: TouchEvent | MouseEvent) => {
      if (!('touches' in e)) {
        e.preventDefault()
      }

      setState(prev => ({
        ...prev,
        mousedown: true,
        // dragStartX: ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX,
        // dragStartY: ('ontouchstart' in window) ? e.touches[0].clientY : e.clientY,
        dragStartX: ('touches' in e) ? e.touches[0].clientX : e.clientX,
        dragStartY: ('touches' in e) ? e.touches[0].clientY : e.clientY
      }))
    }

    /**
     * Trigger actions when mouse is pressed and then moved (mouse drag)
     */
    const handleMousemove = (e: TouchEvent | MouseEvent) => {
      if (!state.mousedown) {
        return
      }

      // const eventPosX = ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX
      // const eventPosY = ('ontouchstart' in window) ? e.touches[0].clientY : e.clientY
      const eventPosX = ('touches' in e) ? e.touches[0].clientX : e.clientX
      const eventPosY = ('touches' in e) ? e.touches[0].clientY : e.clientY

      const deltaX = (state.dragStartX - eventPosX)
      const deltaY = (state.dragStartY - eventPosY)

      const dragOffsetX = deltaX
      const dragOffsetY = deltaY

      // If the swipe is more significant on the Y axis, do not move the slides because this is a scroll gesture
      if (Math.abs(dragOffsetY) > Math.abs(dragOffsetX)) {
        return
      }

      if (dragOffsetX > minSwipeDistance) {
        handleMouseup()
        goNext()
      } else if (dragOffsetX < -minSwipeDistance) {
        handleMouseup()
        goPrev()
      }
    }

    // this.attachMutationObserver()

    const refCurrent = ref.current
    if ('ontouchstart' in window) {
      refCurrent.addEventListener('touchstart', handleMousedown)
      refCurrent.addEventListener('touchend', handleMouseup)
      refCurrent.addEventListener('touchmove', handleMousemove)
    } else {
      refCurrent.addEventListener('mousedown', handleMousedown)
      refCurrent.addEventListener('mouseup', handleMouseup)
      refCurrent.addEventListener('mousemove', handleMousemove)
    }

    return () => {
      if (!refCurrent) {
        return
      }
      if ('ontouchstart' in window) {
        refCurrent.removeEventListener('touchstart', handleMousedown)
        refCurrent.removeEventListener('touchend', handleMouseup)
        refCurrent.removeEventListener('touchmove', handleMousemove)
      } else {
        refCurrent.removeEventListener('mousedown', handleMousedown)
        refCurrent.removeEventListener('mouseup', handleMouseup)
        refCurrent.removeEventListener('mousemove', handleMousemove)
      }
    }
  }, [state.mousedown, state.dragStartX, state.dragStartY, minSwipeDistance, goNext, goPrev])

  /**
   * attach | detach resize event handler
   */
  useEffect(() => {
    const setSize = () => setViewport(prev => ref.current?.clientWidth || prev)
    setSize()

    /**
     * A mutation observer is used to detect changes to the containing node
     * in order to keep the magnet container in sync with the height its reference node.
     */
    const attachMutationObserver = () => {
      const MutationObserver = window.MutationObserver
      // const MutationObserver = window.MutationObserver ||
      //     window.WebKitMutationObserver ||
      //     window.MozMutationObserver

      if (MutationObserver) {
        const mutationObserver = new MutationObserver(setSize)

        if (ref.current) {
          mutationObserver.observe(ref.current, {
            attributes: true,
            childList: true,
            characterData: true
          })
        }

        return mutationObserver
      }
    }
    const detachMutationObserver = (mutationObserver: MutationObserver | undefined) => {
      if (mutationObserver) {
        mutationObserver.disconnect()
      }
    }

    const mutationObserver = attachMutationObserver()
    window.addEventListener('resize', setSize)
    return () => {
      detachMutationObserver(mutationObserver)
      window.removeEventListener('resize', setSize)
    }
  }, [])

  /**
   * watch autoplay effect
   */
  useEffect(() => {
    if (!autoplay || !isNextPossible) {
      return
    }

    const startAutoplay = () => {
      if (autoplayTimeOutRef.current) {
        clearTimeout(autoplayTimeOutRef.current)
      }
      autoplayTimeOutRef.current = setTimeout(
        () => autoplayDirection === EDirection.LTR
          ? goNext()
          : goPrev(),
        autoplayTimeout
      )
    }

    const pauseAutoplay = () => {
      if (autoplay && autoplayTimeOutRef.current) {
        clearTimeout(autoplayTimeOutRef.current)
        autoplayTimeOutRef.current = undefined
      }
    }

    const refCurrent = ref.current
    if (autoplayHoverPause && refCurrent) {
      refCurrent.addEventListener('mouseenter', pauseAutoplay)
      refCurrent.addEventListener('mouseleave', startAutoplay)
    }

    startAutoplay()
    return () => {
      pauseAutoplay()

      if (autoplayHoverPause && refCurrent) {
        refCurrent.removeEventListener('mouseenter', pauseAutoplay)
        refCurrent.removeEventListener('mouseleave', startAutoplay)
      }
    }
  }, [autoplay, autoplayHoverPause, autoplayTimeout, isNextPossible, autoplayDirection, goNext, goPrev])

  const slideProps: SlideProps = {
    total: state.total,
    currentIndex: state.currentIndex,
    animationSpeed,
    border,
    clickable,
    disable3d,
    hasHiddenSlides,
    inverseScaling,
    leftIndices,
    leftOutIndex,
    oneDirectional,
    perspective,
    rightIndices,
    rightOutIndex,
    slideHeight,
    slideWidth,
    space,
    width,
    goTo: animateToSlide,
    onMainSlideClick: props.onMainSlideClick
  }

  return (
    <div ref={ref} className={clsx('slider-3d-container', props.className)} style={{ height: slideHeight + 'px' }}>
      <div className="slider-3d-slider" style={{ width: slideWidth + 'px', height: slideHeight + 'px' }}>
        {props.items.map((item, index) => (
          <Slide
            {...slideProps}
            key={typeof item === 'string' ? `${index}-${item}` : index}
            index={index}
            isActive={index === state.currentIndex}
          >
            {
              typeof item === 'string'
                ? <img src={item} alt="" />
                : item
            }
          </Slide>
        ))}
      </div>

      {controlsVisible && (
        <Controls
          isNextPossible={isNextPossible}
          isPrevPossible={isPrevPossible}
          nextHtml={controlsNextHtml}
          prevHtml={controlsPrevHtml}
          width={controlsWidth}
          height={controlsHeight}
          goNext={goNext}
          goPrev={goPrev}
        />
      )}
    </div>
  )
}

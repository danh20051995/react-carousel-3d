import { useDidMountEffect } from '@/hooks/useDidMountEffect'
import { FC, MouseEvent as RMouseEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Controls } from './controls'
import { Slide } from './slide'

import './style.scss'

/**
 * Calculate slide with and keep defined aspect ratio
 */
const calculateAspectRatio = (width: number, height: number) => Math.min(width / height)

enum EBias {
  LEFT = 'left',
  RIGHT = 'right',
}

enum EDir {
  LTR = 'ltr',
  RTL = 'rtl',
}

export interface Carousel3dProps {
  items: string[] | ReactNode[]
  className?: string | string[] | { [className: string]: boolean }
  autoplay?: boolean
  autoplayTimeout?: number
  autoplayHoverPause?: boolean

  animationSpeed?: number
  bias?: EBias
  dir?: EDir
  loop?: boolean
  clickable?: boolean
  disable3d?: boolean
  oneDirectional?: boolean
  controlsHeight?: number
  controlsNextHtml?: string
  controlsPrevHtml?: string
  controlsVisible?: boolean
  controlsWidth?: number
  count?: number | string
  display?: number
  space?: number | string
  border?: number
  width?: number
  height?: number
  startIndex?: number
  perspective?: number
  inverseScaling?: number
  minSwipeDistance?: number
  onLastSlide?: (index: number) => any
  onMainSlideClick?: (event: RMouseEvent<Element, MouseEvent>, index: number) => any
  onBeforeSlideChange?: (index: number) => any
  onSlideChange?: (index: number) => any
}

export const Carousel3d: FC<Carousel3dProps> = ({
  autoplay = false,
  autoplayTimeout = 2000,
  autoplayHoverPause = true,

  animationSpeed = 500,
  bias = 'left',
  border = 1,
  clickable = true,
  controlsHeight = 50,
  controlsNextHtml = '&rsaquo;',
  controlsPrevHtml = '&lsaquo;',
  controlsVisible = false,
  controlsWidth = 50,
  count = 0,
  dir = 'rtl',
  disable3d = false,
  display = 5,
  height = 270,
  inverseScaling = 300,
  loop = false,
  minSwipeDistance = 10,
  oneDirectional = false,
  onLastSlide = () => {},
  onMainSlideClick = () => {},
  onBeforeSlideChange = () => {},
  onSlideChange = () => {},
  perspective = 35,
  space = 'auto',
  startIndex = 0,
  width = 360,
  ...props
}) => {
  const [walkStep, setWalkStep] = useState(0)

  const [state, setState] = useState({
    viewport: 0,
    currentIndex: startIndex,
    total: props.items.length,
    dragOffsetX: 0,
    dragStartX: 0,
    dragOffsetY: 0,
    dragStartY: 0,
    mousedown: false,
    zIndex: 998
  })

  const isLastSlide = useMemo(
    () => state.currentIndex === state.total - 1,
    [state.currentIndex, state.total]
  )

  const isFirstSlide = useMemo(
    () => state.currentIndex === 0,
    [state.currentIndex]
  )

  const isNextPossible = useMemo(
    () => !(!loop && isLastSlide),
    [loop, isLastSlide]
  )

  const isPrevPossible = useMemo(
    () => !(!loop && isFirstSlide),
    [loop, isFirstSlide]
  )

  const slideWidth = useMemo(() => {
    const vw = state.viewport
    const sw = width + (border * 2)
    // return vw < sw ? vw : sw
    return sw
  }, [state.viewport, width, border])

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
        dir === EDir.LTR
          ? state.currentIndex + m
          : state.currentIndex - m
      ) % state.total

      const result = index < 0
        ? state.total + index
        : index

      indices.push(result)
    }

    return indices
  }, [state.currentIndex, state.total, visible, bias, dir])

  const rightIndices = useMemo(() => {
    let n = (visible - 1) / 2

    n = bias.toLowerCase() === EBias.RIGHT
      ? Math.ceil(n)
      : Math.floor(n)

    const indices = []
    for (let m = 1; m <= n; m++) {
      const index = (
        dir === EDir.RTL
          ? state.currentIndex + m
          : state.currentIndex - m
      ) % state.total

      const result = index < 0
        ? state.total + index
        : index

      indices.push(result)
    }

    return indices
  }, [state.currentIndex, state.total, visible, bias, dir])

  const leftOutIndex = useMemo(() => {
    let n = (visible - 1) / 2
    n = 1 + (
      bias.toLowerCase() === EBias.LEFT
        ? Math.ceil(n)
        : Math.floor(n)
    )

    if (dir === EDir.LTR) {
      return (state.total - state.currentIndex - n) <= 0
        ? -(state.total - state.currentIndex - n)
        : state.currentIndex + n
    }

    return (state.currentIndex - n)
  }, [state.currentIndex, state.total, visible, bias, dir])

  const rightOutIndex = useMemo(() => {
    let n = (visible - 1) / 2

    n = 1 + (
      bias.toLowerCase() === EBias.RIGHT
        ? Math.ceil(n)
        : Math.floor(n)
    )

    if (dir === EDir.LTR) {
      return state.currentIndex - n
    }

    return (state.total - state.currentIndex - n) <= 0
      ? -(state.total - state.currentIndex - n)
      : state.currentIndex + n
  }, [state.currentIndex, state.total, visible, bias, dir])

  /**
   * SECTION: methods
   */

  /**
   * Trigger actions when animation ends
   */
  useEffect(() => {
    onSlideChange(state.currentIndex)
  }, [state.currentIndex, onSlideChange])

  /**
   * Go to slide
   * @param  {String} index of slide where to go
   */
  const goSlide = useCallback((index: number) => {
    const toIndex = index < 0 || index > (state.total - 1) ? 0 : index

    if (isLastSlide) {
      onLastSlide(state.currentIndex)
    }

    onBeforeSlideChange(toIndex)

    setState(prev => ({
      ...prev,
      currentIndex: toIndex
    }))
  }, [state.total, state.currentIndex, isLastSlide, onLastSlide, onBeforeSlideChange])

  /**
   * Go to next slide
   */
  const goNext = useCallback(() => {
    if (isNextPossible) {
      goSlide(
        isLastSlide
          ? 0
          : state.currentIndex + 1
      )
    }
  }, [state.currentIndex, isNextPossible, isLastSlide, goSlide])

  /**
   * Go to previous slide
   */
  const goPrev = useCallback(() => {
    if (isPrevPossible) {
      goSlide(
        isFirstSlide
          ? state.total - 1
          : state.currentIndex - 1
      )
    }
  }, [state.currentIndex, state.total, isPrevPossible, isFirstSlide, goSlide])

  /**
   * Go to slide far slide
   */
  const goTo = useCallback((index: number) => {
    if (state.currentIndex === index) {
      return
    }

    if (!loop) {
      return setWalkStep(() => index - state.currentIndex)
    }

    if (leftIndices.includes(index)) {
      return setWalkStep(() => - 1 - leftIndices.indexOf(index))
    }

    return setWalkStep(() => 1 + rightIndices.indexOf(index))
  }, [state.currentIndex, loop, leftIndices, rightIndices])

  /**
   * Watch effect for walk step
   * Step by step to slide
   */
  useDidMountEffect(() => {
    if (!walkStep) {
      return
    }

    const walkDelay = animationSpeed / Math.abs(walkStep)
    const walkDirection = walkStep < 0 ? EDir.RTL : EDir.LTR
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
          currentIndex: walkDirection === EDir.RTL
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

  // /**
  //  * Trigger actions when mouse is released
  //  * @param  {Object} e The event object
  //  */
  // const handleMouseup = useCallback(() => {
  //   setState(prev => ({
  //     ...prev,
  //     mousedown: false,
  //     dragOffsetX: 0,
  //     dragOffsetY: 0
  //   }))
  // }, [])

  // /**
  //  * Trigger actions when mouse is pressed
  //  * @param  {Object} e The event object
  //  */
  // const handleMousedown = useCallback((e) => {
  //   if (!e.touches) {
  //     e.preventDefault()
  //   }

  //   setState(prev => ({
  //     ...prev,
  //     mousedown: true,
  //     dragOffsetX: ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX,
  //     dragOffsetY: ('ontouchstart' in window) ? e.touches[0].clientY : e.clientY
  //   }))
  // }, [])

  // /**
  //  * Trigger actions when mouse is pressed and then moved (mouse drag)
  //  * @param  {Object} e The event object
  //  */
  // const handleMousemove = useCallback((e) => {
  //   if (!state.mousedown) {
  //     return
  //   }

  //   const eventPosX = ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX
  //   const eventPosY = ('ontouchstart' in window) ? e.touches[0].clientY : e.clientY
  //   const deltaX = (state.dragStartX - eventPosX)
  //   const deltaY = (state.dragStartY - eventPosY)

  //   state.dragOffsetX = deltaX
  //   state.dragOffsetY = deltaY

  //   // If the swipe is more significant on the Y axis, do not move the slides because this is a scroll gesture
  //   if (Math.abs(state.dragOffsetY) > Math.abs(state.dragOffsetX)) {
  //     return
  //   }

  //   if (state.dragOffsetX > minSwipeDistance) {
  //     handleMouseup()
  //     goNext()
  //   } else if (state.dragOffsetX < -minSwipeDistance) {
  //     handleMouseup()
  //     goPrev()
  //   }
  // }, [state, minSwipeDistance, handleMouseup, goNext, goPrev])

  // /**
  //  * A mutation observer is used to detect changes to the containing node
  //  * in order to keep the magnet container in sync with the height its reference node.
  //  */
  // function attachMutationObserver () {
  //   const MutationObserver = window.MutationObserver
  //   // const MutationObserver = window.MutationObserver ||
  //   //     window.WebKitMutationObserver ||
  //   //     window.MozMutationObserver

  //   if (MutationObserver) {
  //     const config = {
  //       attributes: true,
  //       childList: true,
  //       characterData: true
  //     }

  //     this.mutationObserver = new MutationObserver(() => {
  //       this.$nextTick(() => {
  //         this.computeData()
  //       })
  //     })

  //     if (this.$el) {
  //       this.mutationObserver.observe(this.$el, config)
  //     }
  //   }
  // }

  // function detachMutationObserver () {
  //   if (this.mutationObserver) {
  //     this.mutationObserver.disconnect()
  //   }
  // }

  // /**
  //  * Get the number of slides
  //  * @return {Number} Number of slides
  //  */
  // function getSlideCount () {
  //   if (this.$slots.default !== undefined) {
  //     return this.$slots.default.filter((value) => {
  //       return value.tag !== void 0
  //     }).length
  //   }

  //   return 0
  // }

  // /**
  //  * Re-compute the number of slides and current slide
  //  */
  // function computeData (firstRun) {
  //   this.total = this.getSlideCount()
  //   if (firstRun || this.currentIndex >= this.total) {
  //     this.currentIndex = parseInt(this.startIndex) > this.total - 1 ? this.total - 1 : parseInt(this.startIndex)
  //   }

  //   this.viewport = this.$el.clientWidth
  // }

  // function setSize () {
  //   this.$el.style.cssText += 'height:' + this.slideHeight + 'px;'
  //   this.$el.childNodes[0].style.cssText += 'width:' + this.slideWidth + 'px;' + ' height:' + this.slideHeight + 'px;'
  // }

  // useDidMountEffect(() => {
  //   this.computeData(true)
  //   this.attachMutationObserver()
  //   window.addEventListener('resize', this.setSize)

  //   if ('ontouchstart' in window) {
  //     this.$el.addEventListener('touchstart', this.handleMousedown)
  //     this.$el.addEventListener('touchend', this.handleMouseup)
  //     this.$el.addEventListener('touchmove', this.handleMousemove)
  //   } else {
  //     this.$el.addEventListener('mousedown', this.handleMousedown)
  //     this.$el.addEventListener('mouseup', this.handleMouseup)
  //     this.$el.addEventListener('mousemove', this.handleMousemove)
  //   }
  // }, [])

  const slideProps = {
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
    goTo,
    onMainSlideClick
  }

  return (
    <div className="carousel-3d-container" style={{ height: slideHeight + 'px' }}>
      <div className="carousel-3d-slider" style={{ width: slideWidth + 'px', height: slideHeight + 'px' }}>
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
    </div >
  )
}

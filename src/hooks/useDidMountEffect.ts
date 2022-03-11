import { EffectCallback, useEffect, useRef, DependencyList } from 'react'

/**
 * @param {() => any} callback
 * @param {ReadonlyArray<any>} deps React DependencyList
 */
export const useDidMountEffect = (callback: EffectCallback, deps?: DependencyList) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      return callback()
    } else {
      didMount.current = true
    }
  }, deps)
}

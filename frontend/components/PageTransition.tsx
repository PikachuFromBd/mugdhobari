'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [phase, setPhase] = useState<'enter' | 'exit' | 'idle'>('idle')
  const prevPathname = useRef(pathname)
  const isFirstMount = useRef(true)

  useEffect(() => {
    // Skip animation on first mount
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    // Only animate when pathname actually changes
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname

      // Phase 1: fade out the old content
      setPhase('exit')

      const exitTimer = setTimeout(() => {
        // Phase 2: swap content and fade in
        setDisplayChildren(children)
        setPhase('enter')

        const enterTimer = setTimeout(() => {
          setPhase('idle')
        }, 250)

        return () => clearTimeout(enterTimer)
      }, 150)

      return () => clearTimeout(exitTimer)
    } else {
      // Same pathname, just update children (e.g. state changes within page)
      setDisplayChildren(children)
    }
  }, [pathname, children])

  return (
    <div
      className={
        phase === 'exit'
          ? 'page-exit'
          : phase === 'enter'
          ? 'page-enter'
          : ''
      }
    >
      {displayChildren}
    </div>
  )
}

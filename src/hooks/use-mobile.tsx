import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

const LG_BREAKPOINT = 1024 // Tailwind lg breakpoint

export function useIsLarge() {
  const [isLarge, setIsLarge] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`)
    const onChange = () => {
      setIsLarge(window.innerWidth >= LG_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsLarge(window.innerWidth >= LG_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isLarge
}
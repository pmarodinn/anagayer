import { forwardRef } from 'react'
import { LOGO_PATHS, LOGO_W, LOGO_H } from '../lib/logoPaths'

// Logo vetorial. `filled` = sólida (laranja); senão, cada faceta é um <path> traçável.
const LogoMark = forwardRef(function LogoMark({ filled = false, color = '#ea741c', className, title, ...rest }, ref) {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title && <title>{title}</title>}
      {filled ? (
        <path d={LOGO_PATHS.join(' ')} fill={color} fillRule="evenodd" />
      ) : (
        LOGO_PATHS.map((d, i) => <path key={i} d={d} vectorEffect="non-scaling-stroke" />)
      )}
    </svg>
  )
})

export default LogoMark

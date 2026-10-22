import { Link } from '@adonisjs/inertia/react'

/**
 * Logo sementara loginrek: kotak teal + tanda centang (hadir).
 * Ganti dengan aset final dari tim desain (lihat docs/DESIGN.md).
 */
export default function Logo({ size = 26 }: { size?: number }) {
  return (
    <Link route="home" aria-label="loginrek" style={{ display: 'inline-flex' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="var(--brand)" />
        <path
          d="M9 16.5l4.5 4.5L23 11.5"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}

import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="auth">
        <div className="auth__form-col">
          <Logo size={28} />
          <div className="auth__form-wrap">{children}</div>
          <div style={{ height: 20 }} />
        </div>

        <aside className="auth__aside">
          <div className="auth__aside-top">
            <ThemeToggle />
          </div>

          <p className="auth__quote">loginrek — absensi &amp; HR internal perusahaan.</p>

          <div>
            <div className="pitch__t">Dashboard admin</div>
            <p className="pitch__p">
              Kelola karyawan, jadwal kerja, dan rekap kehadiran. Karyawan melakukan absensi lewat
              aplikasi mobile loginrek.
            </p>
          </div>
        </aside>
      </div>
      <FlashToasts />
    </>
  )
}

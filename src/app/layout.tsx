import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Cabin, DM_Sans, Poppins } from 'next/font/google'
import '@/components/style/style1.css'
import '@/components/style/style2.css'
import './globals.css'
import MainTheme from '@/components/theme/MainTheme'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-clock/dist/Clock.css'
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Arc Sip',
  description: 'Arc Sip'
}

export default function RootLayout ({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={`${poppins.variable}`}>
      <body style={{ backgroundColor: 'var(--body-color)' }}>
        <div>
          <MainTheme>{children}</MainTheme>
        </div>
      </body>
    </html>
  )
}

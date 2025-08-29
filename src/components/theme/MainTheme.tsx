'use client'

import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryProvider } from '@/providers/QueryProvider'
import { lightTheme, darkTheme } from '@/components/theme/themes'
import { useThemeStore } from '@/store/useThemeStore'
import Sidebar from '../layout/Sidebar'

export default function MainTheme ({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')
  const { themeMode } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode)
  }, [themeMode])

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <QueryProvider>
        <Toaster />
        {isAuthPage ? (
          <div>
            <>{children}</>
          </div>
        ) : (
          <div style={{ display: 'flex' }}>
            <Sidebar />
            {children}
          </div>
        )}
      </QueryProvider>
    </ThemeProvider>
  )
}

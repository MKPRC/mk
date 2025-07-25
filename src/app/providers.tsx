'use client'

import React from 'react'
import { AuthProvider } from '@/shared/lib/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
} 
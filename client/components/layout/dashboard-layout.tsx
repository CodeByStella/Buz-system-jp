'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const data = await api.auth.me()
      setUser(data.user)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="w-64 bg-white border-r border-gray-200 h-screen">
            <div className="p-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="mt-4 space-y-2">
              {[...Array(13)].map((_, i) => (
                <div key={i} className="px-4 py-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden flex justify-center">
        <div className="w-full max-w-[1440px] h-full p-4">
          <div className="h-full border border-gray-200 bg-white overflow-hidden">
            <div className="flex h-full">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 p-6 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

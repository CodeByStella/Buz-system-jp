'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

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

  const handleLogout = async () => {
    try {
      await api.auth.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const goToAdminOrDashboard = () => {
    if (!user) return
    const isOnAdmin = pathname?.startsWith('/admin')
    router.push(isOnAdmin ? '/dashboard' : '/admin')
  }

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200" style={{ height: 100 }}>
      <div className="h-full mx-auto max-w-[1440px] px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-24 h-10 bg-gray-100 border border-gray-200" />
            <div className="h-8 w-32 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 animate-pulse"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b border-gray-200" style={{ height: 100 }}>
      <div className="h-full mx-auto max-w-[1440px] px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div
            className="w-24 h-10 bg-gray-100 border border-gray-200 cursor-pointer"
            onClick={() => router.push('/dashboard')}
            aria-label="ダッシュボードへ移動"
            role="button"
          />
          <h1 className="text-xl font-semibold text-gray-900">ビジネスシステム</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user?.role === 'ADMIN' && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToAdminOrDashboard}
              className="flex items-center space-x-1"
            >
              <span>{pathname?.startsWith('/admin') ? 'ダッシュボードへ' : '管理画面へ'}</span>
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{user?.name}</span>
            {user?.role === 'ADMIN' && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800">
                管理者
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-1"
          >
            <LogOut className="h-4 w-4" />
            <span>ログアウト</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

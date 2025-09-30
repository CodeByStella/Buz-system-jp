'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'スタート', href: '/dashboard', key: 'start' },
  { name: 'MQ(現状)', href: '/dashboard/mq-current', key: 'mq-current' },
  { name: '①利益', href: '/dashboard/profit', key: 'profit' },
  { name: '②③MQ(未来)', href: '/dashboard/mq-future', key: 'mq-future' },
  { name: '③給料', href: '/dashboard/salary', key: 'salary' },
  { name: '④経費', href: '/dashboard/expenses', key: 'expenses' },
  { name: '⑤製造原価(人)', href: '/dashboard/manufacturing-labor', key: 'manufacturing-labor' },
  { name: '⑥製造(経費)', href: '/dashboard/manufacturing-expenses', key: 'manufacturing-expenses' },
  { name: '⑦原価詳細', href: '/dashboard/cost-details', key: 'cost-details' },
  { name: '損益分岐点', href: '/dashboard/breakeven', key: 'breakeven' },
  { name: '進捗実績値入力シート', href: '/dashboard/progress', key: 'progress' },
  { name: '部門別販売計画', href: '/dashboard/sales-plan', key: 'sales-plan' },
  { name: '利益計画表', href: '/dashboard/profit-plan', key: 'profit-plan' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">ビジネスシステム</h2>
      </div>
      <nav className="mt-4">
        {navigationItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              'block px-4 py-2 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

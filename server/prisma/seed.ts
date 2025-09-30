import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理者',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // Create regular user
  const userPassword = await hashPassword('user123')
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '一般ユーザー',
      password: userPassword,
      role: 'USER'
    }
  })

  // Create global parameters
  const parameters = [
    { key: 'default_tax_rate', value: 0.1, description: 'デフォルト税率' },
    { key: 'social_insurance_rate', value: 0.15, description: '社会保険料率' },
    { key: 'overtime_multiplier', value: 1.25, description: '残業倍率' },
    { key: 'bonus_rate', value: 0.2, description: '賞与率' },
    { key: 'material_cost_rate', value: 0.3, description: '材料費率' },
    { key: 'labor_cost_rate', value: 0.4, description: '人件費率' },
    { key: 'overhead_rate', value: 0.2, description: '間接費率' },
    { key: 'profit_margin_target', value: 0.15, description: '目標利益率' }
  ]

  for (const param of parameters) {
    await prisma.globalParameter.upsert({
      where: { key: param.key },
      update: {},
      create: param
    })
  }

  console.log('Seed data created successfully!')
  console.log('Admin user: admin@example.com / admin123')
  console.log('Regular user: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

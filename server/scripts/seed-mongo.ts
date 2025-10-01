import 'dotenv/config'
import { connectToDatabase } from '../lib/mongo'
import { User } from '../models/user'
import { GlobalParameter } from '../models/global-parameter'
import { hashPassword } from '../lib/auth'

async function main() {
  await connectToDatabase()

  // Upsert admin
  const adminPassword = await hashPassword('admin123')
  await User.updateOne(
    { email: 'admin@example.com' },
    { $setOnInsert: { name: '管理者', password: adminPassword, role: 'ADMIN' } },
    { upsert: true }
  )

  // Upsert user
  const userPassword = await hashPassword('user123')
  await User.updateOne(
    { email: 'user@example.com' },
    { $setOnInsert: { name: '一般ユーザー', password: userPassword, role: 'USER' } },
    { upsert: true }
  )

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
    await GlobalParameter.updateOne(
      { key: param.key },
      { $set: { value: param.value, description: param.description } },
      { upsert: true }
    )
  }

  console.log('✅ Mongo seed complete')
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})



const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const merchants = await prisma.merchant.findMany();
  console.log('--- Merchants ---');
  merchants.forEach(m => {
    console.log(`${m.name} (${m.email})`);
  });

  const payments = await prisma.payment.findMany({ orderBy: { created_at: 'desc' } });
  console.log('\n--- Payments ---');
  payments.forEach(p => {
    console.log(`${p.payment_id}: ${p.amount} (${p.status})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

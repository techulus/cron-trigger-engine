import { Prisma, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  status: 'running' | 'failing' | 'pending';
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;

  const prisma = new PrismaClient();

  if (req.method === 'GET') {
    const result: { status: string }[] = await prisma.$queryRaw(Prisma.sql`
    SELECT * FROM cron.job_run_details where jobid = ${parseInt(
      String(id),
    )} order by start_time desc limit 1;
    `);

    if (!result.length) {
      return res.status(200).json({ status: 'pending' });
    }

    res.status(200).json({
      status: result[0]?.status === 'succeeded' ? 'running' : 'failing',
    });
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;

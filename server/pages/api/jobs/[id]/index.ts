import { Job, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  job?: Job;
  error?: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;

  const prisma = new PrismaClient();

  // Fetch the job
  const job = await prisma.job.findUnique({ where: { id: Number(id) } });

  if (!job) {
    return res.status(400).json({ success: false, error: 'Invalid Job ID' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, job });
  } else if (req.method === 'DELETE') {
    await prisma.job.delete({ where: { id: Number(id) } });

    if (job?.cronServerId) {
      await prisma.$queryRaw`SELECT cron.unschedule(${job?.cronServerId})`;
    }

    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', 'GET,DELETE,PUT');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;

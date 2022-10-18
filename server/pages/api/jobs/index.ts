import { Job, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  jobs?: Job[];

  job?: Job;
  error?: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const prisma = new PrismaClient();

  if (req.method === 'GET') {
    const jobs = await prisma.job.findMany();

    res.status(200).json({ jobs });
  } else if (req.method === 'POST') {
    const { name, url } = req.body;

    // Create the job
    const job = await prisma.job.create({
      data: {
        name,
        url,
      },
    });

    if (!job) {
      return res.status(400).json({ error: 'Create job failed' });
    }

    // Start the cron job
    const result: { schedule: BigInt }[] = await prisma.$queryRawUnsafe(
      `select cron.schedule('* * * * *', $$
      select status from http_get('${url}');
      $$);`,
    );

    if (result.length) {
      await prisma.job.update({
        where: { id: job.id },
        data: { cronServerId: Number(result[0].schedule) },
      });

      res
        .status(200)
        .json({ job: { ...job, cronServerId: Number(result[0].schedule) } });
    } else {
      await prisma.job.delete({ where: { id: job.id } });
      res.status(500).json({ error: 'Failed to start cron job' });
    }
  } else {
    res.setHeader('Allow', 'GET,POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;

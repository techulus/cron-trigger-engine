import { Job, Prisma, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export type JobRun = {
  runid: number;
  status: string;
  start_time: string;
  end_time: string;
  return_message: string;
};

type Data = {
  job?: Job;
  runs?: JobRun[];
  error?: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;

  const prisma = new PrismaClient();

  // Fetch the job
  const job = await prisma.job.findUnique({ where: { id: Number(id) } });

  if (!job) {
    return res.status(400).json({ error: 'Invalid Job ID' });
  }

  if (req.method === 'GET') {
    const jobRuns: JobRun[] = await prisma.$queryRaw(Prisma.sql`
    SELECT * FROM cron.job_run_details where jobid = ${parseInt(
      String(id),
    )} order by start_time desc limit 25;
    `);

    return res.status(200).json({
      job,
      runs: jobRuns.map((run) => {
        const { runid, status, start_time, end_time, return_message } = run;
        return {
          runid: parseInt(String(runid)),
          status,
          start_time,
          end_time,
          return_message,
        };
      }),
    });
  } else if (req.method === 'DELETE') {
    await prisma.job.delete({ where: { id: Number(id) } });

    if (job?.cronServerId) {
      await prisma.$queryRaw`SELECT cron.unschedule(${job?.cronServerId})`;
    }

    res.status(200).json({});
  } else {
    res.setHeader('Allow', 'GET,DELETE,PUT');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;

import { Job } from '@prisma/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { SpinnerWithSpacing } from '../../components/spinner';
import { getJobDetailsById, Queries } from '../../helpers/query';
import { JobRun } from '../api/jobs/[id]';
import { useMutation } from 'react-query';
import axios from 'axios';

const JobRunView = ({ run }: { run: JobRun }) => {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
        {run.return_message === '1 row' ? 'OK' : run.return_message}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {new Date(run.start_time).toLocaleString()}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {new Date(run.end_time).toLocaleString()}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {(run.status === 'succeeded' && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Success
          </span>
        )) || (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Failed
          </span>
        )}
      </td>
    </tr>
  );
};

const JobDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading, error, data } = useQuery<{ job: Job; runs: JobRun[] }>(
    [Queries.JobStatus, id],
    () => getJobDetailsById(Number(id)),
    { enabled: !!id },
  );

  const { job, runs } = data ?? {};

  const cancelJob = useMutation((id: string) => {
    return axios.delete(`/api/jobs/${id}`);
  });

  useEffect(() => {
    if (error) {
      console.error('Fetch job error', error);
      toast('Failed to fetch jobs');
    }
  }, [error]);

  return (
    <div className="min-h-full">
      <div className="bg-gray-800 pb-32">
        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {isLoading ? 'Loading...' : job?.name}
            </h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white px-6 py-6 shadow">
            {isLoading ? (
              <SpinnerWithSpacing />
            ) : (
              <div className="px-2">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">
                      Trigger logs
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                      A list of all the job triggers
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Pause
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto ml-4"
                      onClick={() => cancelJob.mutate(String(id))}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div
                  className="mt-8 flex flex-col"
                  style={{ minHeight: '70vh' }}
                >
                  <div className="-my-2 -mx-8 overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                      <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                              >
                                Response
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Start
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                End
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {runs?.map((run: JobRun) => (
                              <JobRunView run={run} key={run.runid} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;

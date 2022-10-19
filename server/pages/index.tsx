import { Job } from '@prisma/client';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { SpinnerWithSpacing } from '../components/spinner';
import { getJobs, getJobStatus, Queries } from '../helpers/query';
import cronstrue from 'cronstrue';

const Job = ({ job }: { job: Job }) => {
  const { data: status } = useQuery<'running' | 'failing' | 'pending'>(
    [Queries.JobStatus, job.id],
    () => getJobStatus(job.id),
  );

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
        {job.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {job.url}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {cronstrue.toString(job.schedule)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {(status === 'running' && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Running
          </span>
        )) ||
          null}
        {status === 'failing' && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            Failing
          </span>
        )}
        {status === 'pending' && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Pending
          </span>
        )}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          Edit<span className="sr-only">, {job.name}</span>
        </a>
        <a href="#" className="text-red-600 hover:text-red-900 ml-4">
          Delete<span className="sr-only">, {job.name}</span>
        </a>
      </td>
    </tr>
  );
};

const Home: NextPage = () => {
  const { isLoading, error, data: jobs } = useQuery(Queries.Job, getJobs);

  return (
    <div className="min-h-full">
      <div className="bg-gray-800 pb-32">
        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Dashboard
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
                      Jobs
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                      A list of all the cron triggers scheduled
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Add job
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex flex-col">
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
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Title
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Schedule
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Status
                              </th>
                              <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                              >
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {jobs?.map((job: Job) => (
                              <Job job={job} key={job.id} />
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

export default Home;

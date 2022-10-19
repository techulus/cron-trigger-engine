import { Job } from '@prisma/client';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { SpinnerWithSpacing } from '../components/spinner';
import { getJobs, Queries } from '../helpers/query';
import { ChevronRightIcon, EnvelopeIcon } from '@heroicons/react/20/solid';

const Job = ({ job }: { job: Job }) => (
  <li>
    <a href={`/jobs/${job.id}`} className="block hover:bg-gray-50">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
            <div>
              <p className="truncate text-sm font-medium text-indigo-600">
                {job.name}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500">
                <EnvelopeIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <span className="truncate">* * * * *</span>
              </p>
            </div>
          </div>
        </div>
        <div>
          <ChevronRightIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </a>
  </li>
);

const Home: NextPage = () => {
  const { isLoading, error, data: jobs } = useQuery(Queries.Job, () => getJobs);

  return (
    <div className="min-h-full">
      <div className="bg-gray-800 pb-32">
        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Jobs
            </h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
            {isLoading ? (
              <SpinnerWithSpacing />
            ) : (
              <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {jobs?.map((job: Job) => (
                    <Job key={job.id} job={job} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

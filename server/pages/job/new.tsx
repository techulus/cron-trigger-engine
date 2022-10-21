import { Job } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { InlineErrorMessage } from '../../components/notification';
import { isValidCron } from 'cron-validator';
import { Spinner } from '../../components/spinner';
import { Queries } from '../../helpers/query';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

const CreateJob: NextPage = () => {
  const router = useRouter();

  const { mutate, isLoading, error } = useMutation((job: Job) => {
    return axios.post('/api/jobs', { ...job });
  });

  const NewJobSchema = Yup.object().shape({
    name: Yup.string().required('Name cannot be empty'),
    url: Yup.string().url().required('URL cannot be empty'),
    schedule: Yup.string().required('Schedule cannot be empty'),
  });

  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      name: '',
      url: '',
      schedule: '',
    },
    validationSchema: NewJobSchema,
    onSubmit: (values) => {
      if (!isValidCron(values.schedule)) {
        formik.setFieldError(
          'schedule',
          'Please enter a valid CRON expression',
        );
        return;
      }

      mutate(values as Job);

      queryClient.invalidateQueries([Queries.Jobs]);

      router.push('/');
    },
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
            <nav className="flex" aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div>
                    <Link href="/">
                      <a className="text-sm font-medium text-gray-500 hover:text-gray-700">
                        Dashboard
                      </a>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                      New
                    </div>
                  </div>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Create Job
            </h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white px-6 py-6 shadow">
            <div className="flex flex-col">
              <div className="space-y-6 sm:space-y-5 sm:pt-10">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Trigger Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This trigger will be started immediately.
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  <div className="space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Job name
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={formik.handleChange}
                          value={formik.values.name}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                        {formik.errors.name && formik.touched.name && (
                          <div className="mt-2">
                            <InlineErrorMessage message={formik.errors.name} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        URL
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="url"
                          id="url"
                          onChange={formik.handleChange}
                          value={formik.values.url}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                        {formik.errors.url && formik.touched.url && (
                          <div className="mt-2">
                            <InlineErrorMessage message={formik.errors.url} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Schedule
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="schedule"
                          id="schedule"
                          onChange={formik.handleChange}
                          value={formik.values.schedule}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                        {formik.errors.schedule && formik.touched.schedule && (
                          <div className="mt-2">
                            <InlineErrorMessage
                              message={formik.errors.schedule}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <Link href="/">
                          <a className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Cancel
                          </a>
                        </Link>
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          disabled={isLoading}
                        >
                          {isLoading ? <Spinner /> : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;

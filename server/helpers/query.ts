import axios from 'axios';

export const Queries = {
  Jobs: 'jobs',
  JobStatus: 'jobStatus',
  JobDetails: 'jobDetails',
};

export const getJobs = () =>
  axios.get('/api/jobs').then((res) => res.data?.jobs);

export const getJobStatus = (id: number) =>
  axios.get(`/api/jobs/${id}/status`).then((res) => res.data?.status);

export const getJobDetailsById = (id: number) =>
  axios.get(`/api/jobs/${id}`).then((res) => res.data);

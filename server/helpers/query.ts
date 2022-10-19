import axios from 'axios';

export const Queries = {
  Job: 'jobData',
  JobStatus: 'jobStatusData',
};

export const getJobs = () =>
  axios.get('/api/jobs').then((res) => res.data?.jobs);

export const getJobStatus = (id: number) =>
  axios.get(`/api/jobs/${id}/status`).then((res) => res.data?.status);

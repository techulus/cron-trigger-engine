import axios from 'axios';

export const Queries = {
  Job: 'jobData',
};

export const getJobs = axios.get('/api/jobs').then((res) => res.data?.jobs);

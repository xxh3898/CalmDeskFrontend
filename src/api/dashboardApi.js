import apiClient from './axios.js';

export const startCoolDown = async (payload) => {
  const response = await apiClient.post('/employee/dashboard/cooldown', payload);
  return response.data;
};
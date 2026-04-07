import apiClient from "./apiClient";

const RULE_API_URL = "/rules";

export const getRules = async () => {
  const response = await apiClient.get(RULE_API_URL);
  return response.data;
};

export const createRule = async (ruleData) => {
  const response = await apiClient.post(`${RULE_API_URL}/create-rule`, ruleData);
  return response.data;
};

export const updateRule = async (ruleId, ruleData) => {
  const response = await apiClient.put(`${RULE_API_URL}/${ruleId}`, ruleData);
  return response.data;
};

export const deleteRule = async (ruleId) => {
  const response = await apiClient.delete(`${RULE_API_URL}/${ruleId}`);
  return response.data;
};

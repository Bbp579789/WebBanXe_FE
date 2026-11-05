import { apiClient } from "./apiClient";

import type {
  BackendCustomer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "../../../types/adminCustomer.types";

const USER_ENDPOINT = "/users";

// Xử lý response có thể được bọc trong data
const unwrapResponse = (response: any): any => {
  let result = response;

  for (let i = 0; i < 3; i++) {
    if (
      result &&
      !Array.isArray(result) &&
      typeof result === "object" &&
      result.data !== undefined
    ) {
      result = result.data;
    } else {
      break;
    }
  }

  return result;
};

const extractUsers = (response: any): BackendCustomer[] => {
  const result = unwrapResponse(response);

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.users)) {
    return result.users;
  }

  if (Array.isArray(result?.items)) {
    return result.items;
  }

  if (Array.isArray(result?.customers)) {
    return result.customers;
  }

  return [];
};

export const customerService = {
  // GET /api/v1/users
  getCustomers: async (): Promise<BackendCustomer[]> => {
    const response = await apiClient.get(USER_ENDPOINT);

    const users = extractUsers(response);

    return users.filter((user) => user.role === "customer");
  },

  // GET /api/v1/users/:id
  getCustomerById: async (
    id: number
  ): Promise<BackendCustomer> => {
    const response = await apiClient.get(`${USER_ENDPOINT}/${id}`);

    return unwrapResponse(response);
  },

  // POST /api/v1/users
  createCustomer: async (
    payload: CreateCustomerPayload
  ): Promise<BackendCustomer> => {
    const response = await apiClient.post(USER_ENDPOINT, payload);

    return unwrapResponse(response);
  },

  // PUT /api/v1/users/:id
  updateCustomer: async (
    id: number,
    payload: UpdateCustomerPayload
  ): Promise<BackendCustomer> => {
    const response = await apiClient.put(
      `${USER_ENDPOINT}/${id}`,
      payload
    );

    return unwrapResponse(response);
  },

  // DELETE /api/v1/users/:id
  deleteCustomer: async (id: number): Promise<any> => {
    const response = await apiClient.delete(`${USER_ENDPOINT}/${id}`);

    return unwrapResponse(response);
  },
};
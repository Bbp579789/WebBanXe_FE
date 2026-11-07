import { apiClient } from './apiClient';

export interface CreateContractPayload {
  vehicle_ids: number[];
  shipping_address: string;
  purchase_type: 'cash' | 'transaction';
  description?: string;
}

export interface ContractResponse {
  id?: number;
  contract_id?: number;
  contractId?: number;
  data?: ContractResponse;
  contract?: ContractResponse;
}

export async function createContract(
  payload: CreateContractPayload
): Promise<ContractResponse> {
  const response = await apiClient.post<ContractResponse>(
    '/contracts',
    payload
  );

  return response.data;
}
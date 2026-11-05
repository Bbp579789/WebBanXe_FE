
import { apiClient } from "./apiClient";

import type {
  Contract,
  CreateContractPayload,
  UpdateContractPayload,
} from "../../../types/adminContract.types";

const CONTRACT_ENDPOINT = "/contracts";
const PAGE_SIZE = 100;
const MAX_PAGES = 100;

// Kiểu dữ liệu một trang API
interface ContractPage {
  items: any[];
  pagination: any;
}

// Bóc response và giữ lại thông tin pagination
const getPageResponse = (response: any): ContractPage => {
  let result = response;

  for (let i = 0; i < 5; i++) {
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      break;
    }

    // Dạng { data: [...], pagination: {...} }
    if (Array.isArray(result.data)) {
      return {
        items: result.data,
        pagination:
          result.pagination ||
          result.meta ||
          null,
      };
    }

    // Dạng { contracts: [...], pagination: {...} }
    if (Array.isArray(result.contracts)) {
      return {
        items: result.contracts,
        pagination: result.pagination || result.meta || null,
      };
    }

    if (Array.isArray(result.items)) {
      return {
        items: result.items,
        pagination: result.pagination || result.meta || null,
      };
    }

    // Bóc lớp data tiếp theo
    if (result.data !== undefined) {
      result = result.data;
      continue;
    }

    break;
  }

  if (Array.isArray(result)) {
    return {
      items: result,
      pagination: null,
    };
  }

  return {
    items: [],
    pagination: null,
  };
};

// Chuẩn hóa một hợp đồng
const normalizeContract = (item: any): Contract | null => {
  let result = item;

  for (let i = 0; i < 5; i++) {
    if (
      result &&
      !Array.isArray(result) &&
      typeof result === "object" &&
      result.id === undefined &&
      result.data !== undefined
    ) {
      result = result.data;
    } else {
      break;
    }
  }

  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result) ||
    result.id === undefined ||
    result.id === null ||
    String(result.id).trim() === ""
  ) {
    return null;
  }

  return result as Contract;
};

// Lấy tổng số trang từ metadata Backend
const getTotalPages = (
  pagination: any,
  fallbackPageSize: number
): number | null => {
  if (!pagination) return null;

  const totalPages = Number(
    pagination.totalPages ??
    pagination.total_pages ??
    pagination.lastPage ??
    pagination.last_page
  );

  if (Number.isFinite(totalPages) && totalPages > 0) {
    return totalPages;
  }

  const total = Number(
    pagination.total ??
    pagination.totalItems ??
    pagination.total_items ??
    pagination.count
  );

  const limit = Number(
    pagination.limit ??
    pagination.pageSize ??
    pagination.page_size ??
    pagination.perPage ??
    pagination.per_page ??
    fallbackPageSize
  );

  if (
    Number.isFinite(total) &&
    total >= 0 &&
    Number.isFinite(limit) &&
    limit > 0
  ) {
    return Math.ceil(total / limit);
  }

  return null;
};

// GET tất cả hợp đồng bằng cách lấy lần lượt các trang
const fetchAllContracts = async (): Promise<Contract[]> => {
  const contractMap = new Map<string, Contract>();

  let currentPage = 1;
  let totalPages: number | null = null;

  while (currentPage <= MAX_PAGES) {
    const response = await apiClient.get(CONTRACT_ENDPOINT, {
      params: {
        page: currentPage,
        limit: PAGE_SIZE,
      },
    });

    const pageResult = getPageResponse(response);

    const contracts = pageResult.items
      .map(normalizeContract)
      .filter((item): item is Contract => item !== null);

    let newContracts = 0;

    contracts.forEach((contract) => {
      const id = String(contract.id);

      if (!contractMap.has(id)) {
        contractMap.set(id, contract);
        newContracts++;
      }
    });

    if (totalPages === null) {
      totalPages = getTotalPages(
        pageResult.pagination,
        PAGE_SIZE
      );
    }

    console.log(`========== CONTRACT PAGE ${currentPage} ==========`);
    console.log("Số hợp đồng nhận được:", contracts.length);
    console.log("Số hợp đồng mới:", newContracts);
    console.log("Pagination:", pageResult.pagination);
    console.log("Tổng số hợp đồng đã lấy:", contractMap.size);

    // Có metadata tổng số trang
    if (totalPages !== null && currentPage >= totalPages) {
      break;
    }

    // Không có metadata: dừng khi API không còn dữ liệu mới.
    if (totalPages === null) {
      if (pageResult.items.length === 0 || newContracts === 0) {
        break;
      }

      if (pageResult.items.length < PAGE_SIZE) {
        break;
      }
    }

    currentPage++;
  }

  const result = Array.from(contractMap.values());

  console.log("========== ALL CONTRACTS ==========");
  console.log("Tổng hợp đồng đã tải:", result.length);
  console.log("Contract IDs:", result.map((item) => item.id));

  return result;
};

const unwrapResponse = (response: any): any => {
  let result = response;

  for (let i = 0; i < 5; i++) {
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

const extractContract = (response: any): Contract => {
  const contract = normalizeContract(response);

  if (!contract) {
    throw new Error("Không tìm thấy contract.id hợp lệ.");
  }

  return contract;
};

export const contractService = {
  // GET /api/v1/contracts
  // Lấy toàn bộ hợp đồng qua nhiều trang Backend
  getAllContracts: async (): Promise<Contract[]> => {
    return fetchAllContracts();
  },

  // GET /api/v1/contracts/me
  getMyContracts: async (): Promise<Contract[]> => {
    const response = await apiClient.get(
      `${CONTRACT_ENDPOINT}/me`
    );

    const pageResult = getPageResponse(response);

    return pageResult.items
      .map(normalizeContract)
      .filter((item): item is Contract => item !== null);
  },

  // GET /api/v1/contracts/:id
  getContractById: async (id: number): Promise<Contract> => {
    const response = await apiClient.get(
      `${CONTRACT_ENDPOINT}/${id}`
    );

    return extractContract(response);
  },

  // POST /api/v1/contracts
  createContract: async (
    payload: CreateContractPayload
  ): Promise<Contract> => {
    const response = await apiClient.post(
      CONTRACT_ENDPOINT,
      payload
    );

    return extractContract(response);
  },

  // PUT /api/v1/contracts/:id
  updateContract: async (
    id: number,
    payload: UpdateContractPayload
  ): Promise<Contract> => {
    const response = await apiClient.put(
      `${CONTRACT_ENDPOINT}/${id}`,
      payload
    );

    return extractContract(response);
  },

  // DELETE /api/v1/contracts/:id
  deleteContract: async (id: number): Promise<any> => {
    const response = await apiClient.delete(
      `${CONTRACT_ENDPOINT}/${id}`
    );

    return unwrapResponse(response);
  },
};

export {
  unwrapResponse,
  normalizeContract,
  getPageResponse,
};

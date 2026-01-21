export type ServiceResponse<T = {} | [] | any> = Promise<{
  success: boolean;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  status: number;
  message: string;
}>;

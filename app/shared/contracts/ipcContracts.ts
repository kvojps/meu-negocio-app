export type ApiSuccess<T> = { success: true; data: T };

export type ApiError = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const formatSuccess = <T>(data: T): ApiSuccess<T> => ({
  success: true,
  data,
});

export const formatError = (
  message: string,
  code?: string,
  details?: unknown,
): ApiError => ({
  success: false,
  error: { message, code, details },
});

export default ApiResponse;
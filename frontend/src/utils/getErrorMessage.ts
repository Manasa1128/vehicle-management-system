import axios from "axios";

type ErrorResponse = {
  message?: string;
};

export const getErrorMessage = (
  error: unknown,
  fallback: string
) => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

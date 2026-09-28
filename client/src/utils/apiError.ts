export const getApiErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;

    return data?.message || "Something went wrong";
  }

  return "Something went wrong";
};

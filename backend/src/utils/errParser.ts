export const errParser = (error: any) => {
  const errMsg =
    error?.response?.data?.message ||
    (!!error?.response?.data && JSON.stringify(error?.response?.data)) ||
    error.message;
  return errMsg;
};

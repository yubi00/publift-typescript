export const formatDate = (date: string): string => {
  const year = date.substr(0, 4);
  const month = date.substr(4, 2);
  const day = date.substr(6);
  return `${year}-${month}-${day}`;
};

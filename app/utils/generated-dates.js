export const generateYearsFromCurrent = length => {
  const startYear = new Date().getFullYear();
  return Array(length).fill(startYear).map((year, index) => year + index);
};

export const generateMonthNumber = () => {
  const months = Array(12).fill(0).map((month, index) => (index < 9 ? `0${index + 1}` : `${index + 1}`));
  return months;
};


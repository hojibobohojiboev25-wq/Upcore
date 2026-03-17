export const formatDate = (value) => {
  const date = new Date(value);
  return `${String(date.getDate()).padStart(2, '0')}.${String(
    date.getMonth() + 1
  ).padStart(2, '0')}.${date.getFullYear()}`;
};

export const isSameDay = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getPastDays = (days) => {
  return Array.from({ length: days }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - idx - 1));
    date.setHours(0, 0, 0, 0);
    return date;
  });
};

export const formatDate = (value) => {
  const date = new Date(value);
  return `${String(date.getDate()).padStart(2, '0')}.${String(
    date.getMonth() + 1
  ).padStart(2, '0')}.${date.getFullYear()}`;
};

export const formatTime = (value, use24Hour = true) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour
  });
};

export const formatDuration = (secondsInput) => {
  const seconds = Math.max(0, Math.floor(Number(secondsInput) || 0));
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
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

export const parseDueAt = ({ dateInput, timeInput }) => {
  const date = String(dateInput || '').trim();
  const time = String(timeInput || '').trim();
  if (!date || !time) return null;

  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  if (
    [year, month, day, hours, minutes].some((item) => Number.isNaN(item)) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const dueDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return Number.isNaN(dueDate.getTime()) ? null : dueDate.toISOString();
};

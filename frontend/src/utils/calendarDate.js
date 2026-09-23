const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const pad2 = (value) => String(value).padStart(2, "0");

export const toDateKeyFromDate = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const extractDateKey = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    if (DATE_KEY_REGEX.test(value)) {
      return value;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return toDateKeyFromDate(date);
};

export const dateFromKeyAtNoon = (dateKey) => {
  if (!DATE_KEY_REGEX.test(String(dateKey || ""))) {
    return null;
  }

  const [year, month, day] = String(dateKey)
    .split("-")
    .map((part) => Number(part));

  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

export const addDaysToDateKey = (dateKey, days) => {
  const date = dateFromKeyAtNoon(dateKey);

  if (!date) {
    return "";
  }

  date.setDate(date.getDate() + Number(days || 0));
  return toDateKeyFromDate(date);
};

export const formatDateValue = (value, options) => {
  const key = extractDateKey(value);

  if (!key) {
    return "";
  }

  const date = dateFromKeyAtNoon(key);

  if (!date) {
    return "";
  }

  return date.toLocaleDateString("es-ES", options);
};

export const getWeekDayIdFromValue = (value) => {
  const key = extractDateKey(value);

  if (!key) {
    return 1;
  }

  const date = dateFromKeyAtNoon(key);

  if (!date) {
    return 1;
  }

  const day = date.getDay();
  return day === 0 ? 7 : day;
};

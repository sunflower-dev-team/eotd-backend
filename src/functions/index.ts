export const getCurrentDate = (): number => {
  const date = new Date(Date.now());
  const year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  month.length === 1 ? (month = 0 + month) : '';
  day.length === 1 ? (day = 0 + day) : '';
  return Number(year + month + day);
};

// export const getCurrentTime = (): string => {
//   const date = new Date(Date.now());
//   const hour = date.getHours();
//   const minute = date.getMinutes();
//   return hour + ':' + minute;
// };

export const convertIsoTimestampToReadableFormat = (
  isoTimestamp: string,
  offsetHours = 7
): string => {
  const date = new Date(isoTimestamp);

  const adjustedDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);

  const year = adjustedDate.getUTCFullYear();
  const month = adjustedDate.getUTCMonth() + 1;
  const day = adjustedDate.getUTCDate();
  const hours = adjustedDate.getUTCHours();
  const minutes = adjustedDate.getUTCMinutes();
  const seconds = adjustedDate.getUTCSeconds();

  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedDate;
};

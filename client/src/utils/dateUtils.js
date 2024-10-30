export const formatDate = (timestamp) => {
  if (typeof timestamp !== 'string' || timestamp.length !== 14) {
    return 'Invalid Date'; // Ensure the timestamp is a valid string with 14 characters
  }

  // Extract year, month, day, hour, minute, and second from the string
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6) - 1; // Month is zero-indexed in JavaScript Date
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(8, 10);
  const minute = timestamp.substring(10, 12);
  const second = timestamp.substring(12, 14);

  // Create a new Date object
  const date = new Date(year, month, day, hour, minute, second);

  // Format the date to the desired format
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', '');  // Format as yyyy-mm-dd hh:mm
};

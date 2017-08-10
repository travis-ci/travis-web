export default function timeInWords(duration) {
  let days, hours, minutes, result, seconds;
  days = Math.floor(duration / 86400);
  hours = Math.floor(duration % 86400 / 3600);
  minutes = Math.floor(duration % 3600 / 60);
  seconds = duration % 60;
  if (days > 0) {
    return 'more than 24 hrs';
  } else {
    result = [];
    if (hours === 1) {
      result.push(`${hours} hr`);
    }
    if (hours > 1) {
      result.push(`${hours} hrs`);
    }
    if (minutes > 0) {
      result.push(`${minutes} min`);
    }
    if (seconds > 0) {
      result.push(`${seconds} sec`);
    }
    if (result.length > 0) {
      return result.join(' ');
    } else {
      return '-';
    }
  }
}

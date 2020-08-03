export default function (time) {
  const today = time;
  // model
  const month = (() => {
    const value = today.getMonth() + 1;
    if (value > 9) {
      return value;
    }
    return `0${value}`;
  })();
  // view
  const dateStr = `${today.getFullYear()}-${month}-${today.getDate()}`;
  return dateStr;
}

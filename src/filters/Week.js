export default function (time) {
  const today = time;
  switch (true) {
    case today === 1:
      return '星期一';
    case today === 2:
      return '星期二';
    case today === 3:
      return '星期三';
    case today === 4:
      return '星期四';
    case today === 5:
      return '星期五';
    case today === 6:
      return '星期六';
    default:
      return '星期日';
  }
}

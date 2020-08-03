export default function (time) {
  const today = time;
  switch (true) {
    case today === 1:
      return '1,3,5,7,9';
    case today === 2:
      return '0,2,4,6,8';
    case today === 3:
      return '1,3,5,7,9';
    case today === 4:
      return '0,2,4,6,8';
    case today === 5:
      return '1,3,5,7,9';
    case today === 6:
      return '0,2,4,6,8';
    default:
      return '不限制';
  }
}

let flag = true;
export const throttle = function (cb, delay) {
  return function () {
    if(!flag) return;
    const context = this;
    const args = arguments;
      cb.apply(context, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, delay)
  }
}
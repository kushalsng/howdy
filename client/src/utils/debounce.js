let timer;
export const debounce = function (cb, delay) {
  return function () {
    const context = this;
    const args = arguments;
    if(timer)clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(context, args);
    }, delay);
  }
}
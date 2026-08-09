export const showLoader = () => {
  window.dispatchEvent(new Event("global-loader-show"));
};

export const hideLoader = () => {
  window.dispatchEvent(new Event("global-loader-hide"));
};

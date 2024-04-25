export const toAbsoluteUrl = (pathname) => {
  console.log(process.env.PUBLIC_URL);
  return process.env.PUBLIC_URL + pathname;
};

export const encodeInBase64 = (string) => {
  if (typeof window === 'object' && window.btoa) {
    return window.btoa(string);
  }
  else {
    return new Buffer(string).toString('base64');
  }
}

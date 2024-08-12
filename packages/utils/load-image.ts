function loadImage(path: string) {
  const { promise, resolve, reject } = Promise.withResolvers<HTMLImageElement>();
  const imageObj = new Image();
  imageObj.src = path;
  imageObj.onload = () => {
    resolve(imageObj);
  };
  imageObj.onerror = (err) => {
    reject(err);
  };
  return promise;
}

export { loadImage };

export default loadImage;

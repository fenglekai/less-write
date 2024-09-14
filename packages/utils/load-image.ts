export function loadImage(path: string) {
  const { promise, resolve, reject } = Promise.withResolvers<HTMLImageElement>();
  const imageObj = new Image();
  imageObj.crossOrigin = 'Anonymous'
  imageObj.src = path;
  imageObj.onload = () => {
    resolve(imageObj);
  };
  imageObj.onerror = (err) => {
    console.error("图片加载失败: ");
    reject(err);
  };
  return promise;
}

export default loadImage;

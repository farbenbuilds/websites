const loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = () => {
      void image.decode().then(
        () => resolve(image),
        () => resolve(image),
      );
    };

    image.onerror = () => reject(new Error(`Could not load ${source}`));
    image.src = source;
  });

export function loadButterflyImages(sources: readonly string[]): Promise<HTMLImageElement[]> {
  if (sources.length === 0) {
    return Promise.reject(new Error("No butterfly sprite sources provided"));
  }

  return Promise.all(sources.map(loadImage));
}

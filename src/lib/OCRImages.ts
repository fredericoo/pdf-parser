import Tesseract from 'tesseract.js';

type OCRImagesOptions = {
  onProgress?: (progress: { current: number; total: number }) => void;
  onStart?: (progress: { current: 0; total: number }) => void;
};

const OCRImages = async (urls: string[], options?: OCRImagesOptions): Promise<Record<string, string>> => {
  options.onStart && options.onStart({ current: 0, total: urls.length });
  const progress = { total: urls.length, current: 0 };

  const promises = urls.map(
    async url =>
      await Tesseract.recognize(url, 'isl').then(({ data: { text } }) => {
        progress.current += 1;
        options.onProgress && options.onProgress(progress);
        return text;
      })
  );

  const texts = await Promise.all(promises);

  return texts.reduce((acc, text, index) => {
    return { ...acc, [index + 1]: text };
  }, {});
};

export default OCRImages;

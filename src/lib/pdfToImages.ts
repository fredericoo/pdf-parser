import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

type PDFToImagesOptions = {
  scale?: number;
  onProgress?: (progress: { current: number; total: number }) => void;
  onStart?: (progress: { current: 0; total: number }) => void;
};

const pdfToImages = async (pdf: string, options?: PDFToImagesOptions): Promise<string[]> => {
  const output = [];
  const doc = await pdfjsLib.getDocument(pdf).promise;

  options.onStart && options.onStart({ current: 0, total: doc.numPages });

  for (let i = 1; i < doc.numPages + 1; i++) {
    const canvas = document.createElement('canvas');

    const page = await doc.getPage(i);
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: options.scale || 1 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    options.onProgress && options.onProgress({ current: i, total: doc.numPages });

    output.push(canvas.toDataURL('image/png'));
  }

  return output;
};

export default pdfToImages;

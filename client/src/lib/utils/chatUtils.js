import calert from 'calerts';
import Compressor from 'compressorjs';

export const toDataUrl = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    const handleError = () => {
      calert('Error', 'Cannot send the image', 'error');
    };

    reader.onload = () => resolve(reader.result);
    reader.onerror = handleError;

    new Compressor(file, {
      width: 600,
      quality: 0.6,
      success: (result) => reader.readAsDataURL(result),
      error: handleError
    });
  });
};

export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

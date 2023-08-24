export const waitForFontLoad = async (font: string, timeout = 2000, interval = 100) => {
  return new Promise((resolve, reject) => {
    const poller = setInterval(async () => {
      try {
        console.debug('Load font', font);
        await document.fonts.load(font);
      } catch (err) {
        reject(err);
      }
      if (document.fonts.check(font)) {
        clearInterval(poller);
        resolve(true);
      }
    }, interval);
    setTimeout(() => clearInterval(poller), timeout);
  });
}

export const replaceBreaksWithHtml = (input: string) => {
  return input.replace(/\n/g, '<br>');
}
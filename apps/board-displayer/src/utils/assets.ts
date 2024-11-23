const ASSETS = {
  SCRAMBLE_BOX: "assets/scrambleBox.png",
  TIMER_BOX: "assets/timerBox.png",
  RANKING_TITLE_BOX: "assets/rankingTitleBox.png",
  PIPE: "assets/pipe.png",
  WRONG: "assets/wrong.png",
  CORRECT: "assets/correct.png",

  CONGRATS_BG: "assets/congratsBg.png",
  GIFT: "assets/gift.png",
};

export const cacheAssets = () =>
  new Promise((resolve) => {
    const imageToLoad = Object.keys(ASSETS).length;
    let imageLoaded = 0;
    if (imageToLoad <= 0) {
      resolve(null);
    }
    Object.keys(ASSETS).forEach((assetKey) => {
      loadImage(ASSETS[assetKey as keyof typeof ASSETS])
        .then(() => {
          imageLoaded++;
          if (imageLoaded >= imageToLoad) {
            resolve(null);
          }
        })
        .catch(() => {
          if (imageLoaded >= imageToLoad) {
            resolve(null);
          }
        });
    });
  });

export const loadImage = (src: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      resolve(null);
    };
    image.onerror = () => {
      reject(null);
    };
  });

export const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });

export { ASSETS };

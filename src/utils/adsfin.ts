export const injectAdsfinScript = (id: string) => {
  const over = document.createElement("script");
  over.type = "text/javascript";
  over.async = true;
  over.src = `https://front.adsfin.net/place/${id}/`;

  const targetElementOver = document.getElementById(`place_${id}`);

  if (targetElementOver && targetElementOver.parentNode) {
    targetElementOver.parentNode.insertBefore(
      over,
      targetElementOver.nextSibling
    );
  }
};

export const formatPlaceId = (id: string) => {
  return `place_${id}`;
};

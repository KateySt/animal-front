export const preloadImage = async (url: string): Promise<void> => {
  const image = new Image();
  image.src = url;
  await image.decode().catch(() => undefined);
};

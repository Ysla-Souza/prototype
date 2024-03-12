import { createImage, createVideo } from "./storage";

export async function registerVideo(data: any) {
  const linkVid = await createVideo(data.video);
  const linkImages = [];
  for (let i = 0; i > data.images.length; i += 1) {
    const linkImg = await createImage(data.images[i]);
    linkImages.push(linkImg);
  }
  if (linkVid) {
    const item = {
      linkVideo: linkVid,
      title: data.title,
      description: data.description,
      requirement: {
        memory: data.requirement.memory,
        operatingSystems: data.requirement.operatingSystems,
        processor: data.requirement.processor,
        graphics: data.requirement.graphics,
        directXVersion: data.requirement.directXVersion,
        storage: data.requirement.storage,
      },
      releaseDate: data.releaseDate,
      publisher: data.publisher,
      developers: data.developers,
      linkImages: linkImages,
      category: data.category,
      PublishDate: Date.now(),
      reviews: [],
    };
  }
}
export const getAttachmentMessage = (data: { content: string; attachments?: string[] }): string => {
  if (data.attachments && data.attachments.length) {
    const photoExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoExts = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    let photoCount = 0;
    let videoCount = 0;
    data.attachments.forEach((link: string | undefined) => {
      if (!link) return;
      const lowerLink = link.toLowerCase();
      if (photoExts.some(ext => lowerLink.endsWith(ext))) photoCount++;
      else if (videoExts.some(ext => lowerLink.endsWith(ext))) videoCount++;
    });

    if (photoCount > 0 && videoCount > 0) {
      return `${photoCount} ${photoCount > 1 ? 'Photos' : 'Photo'}, ${videoCount} ${videoCount > 1 ? 'Videos' : 'Video'}`;
    } else if (photoCount > 0) {
      return `${photoCount} ${photoCount > 1 ? 'Photos' : 'Photo'}`;
    } else if (videoCount > 0) {
      return `${videoCount} ${videoCount > 1 ? 'Videos' : 'Video'}`;
    }
  }
  return data.content;
};
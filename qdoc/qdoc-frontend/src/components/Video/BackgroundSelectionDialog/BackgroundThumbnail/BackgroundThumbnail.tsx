import React from "react";
import useVideoContext from "../../../../contexts/video-context";
import { CloseOutlined, StopOutlined } from "@ant-design/icons";

export type Thumbnail = "none" | "blur" | "image";

interface BackgroundThumbnailProps {
  thumbnail: Thumbnail;
  imagePath?: string;
  name?: string;
  index?: number;
}

const BackgroundThumbnail = ({ thumbnail, imagePath, name, index }: BackgroundThumbnailProps) => {
  const { backgroundSettings, setBackgroundSettings } = useVideoContext();
  const isImage = thumbnail === "image";
  const thumbnailSelected = isImage
    ? backgroundSettings.index === index && backgroundSettings.type === "image"
    : backgroundSettings.type === thumbnail;
  const icons = {
    none: CloseOutlined,
    blur: StopOutlined,
    image: null
  };
  const ThumbnailIcon = icons[thumbnail];

  return (
    <div
      onClick={() =>
        setBackgroundSettings({
          type: thumbnail,
          index
        })
      }
    >
      {ThumbnailIcon ? (
        <div>
          <ThumbnailIcon/>
        </div>
      ) : (
        <img src={imagePath} alt={name} />
      )}
      <div>{name}</div>
    </div>
  );
};
export default BackgroundThumbnail;

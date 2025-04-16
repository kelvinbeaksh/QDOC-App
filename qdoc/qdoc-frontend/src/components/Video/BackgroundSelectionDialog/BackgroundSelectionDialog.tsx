import React, { ReactElement } from "react";
import useVideoContext from "../../../contexts/video-context";
import { backgroundConfig } from "../../../hooks/videos/useBackgroundSettings/useBackgroundSettings";
import BackgroundThumbnail from "./BackgroundThumbnail/BackgroundThumbnail";
import { Drawer } from "antd";

const BackgroundSelectionDialog = ():ReactElement => {
  const { isBackgroundSelectionOpen, setIsBackgroundSelectionOpen } = useVideoContext();

  const { imageNames } = backgroundConfig;
  const { images } = backgroundConfig;

  return (
    <Drawer
      title="Background"
      placement="right"
      visible={isBackgroundSelectionOpen}
      onClose={() => setIsBackgroundSelectionOpen(false)}
    >
      <div>
        <BackgroundThumbnail thumbnail={"none"} name={"None"} />
        <BackgroundThumbnail thumbnail={"blur"} name={"Blur"} />
        {images.map((image, index) => (
          <BackgroundThumbnail
            thumbnail={"image"}
            name={imageNames[index]}
            index={index}
            imagePath={image}
            key={image}
          />
        ))}
      </div>
    </Drawer>
  );
};

export default BackgroundSelectionDialog;

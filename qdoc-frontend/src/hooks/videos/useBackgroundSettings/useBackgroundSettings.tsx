import { LocalVideoTrack, Room } from "twilio-video";
import { useState, useEffect, useCallback } from "react";
import {
  GaussianBlurBackgroundProcessor,
  VirtualBackgroundProcessor,
  ImageFit,
  isSupported
} from "@twilio/video-processors";
import Abstract from "../../../assets/img/video/Abstract.jpg";
import AbstractThumb from "../../../assets/img/video/thumb/Abstract.jpg";
import BohoHome from "../../../assets/img/video/BohoHome.jpg";
import BohoHomeThumb from "../../../assets/img/video/thumb/BohoHome.jpg";
import Bookshelf from "../../../assets/img/video/Bookshelf.jpg";
import BookshelfThumb from "../../../assets/img/video/thumb/Bookshelf.jpg";
import CoffeeShop from "../../../assets/img/video/CoffeeShop.jpg";
import CoffeeShopThumb from "../../../assets/img/video/thumb/CoffeeShop.jpg";
import Contemporary from "../../../assets/img/video/Contemporary.jpg";
import ContemporaryThumb from "../../../assets/img/video/thumb/Contemporary.jpg";
import CozyHome from "../../../assets/img/video/CozyHome.jpg";
import CozyHomeThumb from "../../../assets/img/video/thumb/CozyHome.jpg";
import Desert from "../../../assets/img/video/Desert.jpg";
import DesertThumb from "../../../assets/img/video/thumb/Desert.jpg";
import Fishing from "../../../assets/img/video/Fishing.jpg";
import FishingThumb from "../../../assets/img/video/thumb/Fishing.jpg";
import Flower from "../../../assets/img/video/Flower.jpg";
import FlowerThumb from "../../../assets/img/video/thumb/Flower.jpg";
import Kitchen from "../../../assets/img/video/Kitchen.jpg";
import KitchenThumb from "../../../assets/img/video/thumb/Kitchen.jpg";
import ModernHome from "../../../assets/img/video/ModernHome.jpg";
import ModernHomeThumb from "../../../assets/img/video/thumb/ModernHome.jpg";
import Nature from "../../../assets/img/video/Nature.jpg";
import NatureThumb from "../../../assets/img/video/thumb/Nature.jpg";
import Ocean from "../../../assets/img/video/Ocean.jpg";
import OceanThumb from "../../../assets/img/video/thumb/Ocean.jpg";
import Patio from "../../../assets/img/video/Patio.jpg";
import PatioThumb from "../../../assets/img/video/thumb/Patio.jpg";
import Plant from "../../../assets/img/video/Plant.jpg";
import PlantThumb from "../../../assets/img/video/thumb/Plant.jpg";
import SanFrancisco from "../../../assets/img/video/SanFrancisco.jpg";
import SanFranciscoThumb from "../../../assets/img/video/thumb/SanFrancisco.jpg";
import { SELECTED_BACKGROUND_SETTINGS_KEY } from "../../../constants/constants";

export type Thumbnail = "none" | "blur" | "image";

export interface BackgroundSettings {
  type: Thumbnail;
  index?: number;
}

const imageNames: string[] = [
  "Abstract",
  "Boho Home",
  "Bookshelf",
  "Coffee Shop",
  "Contemporary",
  "Cozy Home",
  "Desert",
  "Fishing",
  "Flower",
  "Kitchen",
  "Modern Home",
  "Nature",
  "Ocean",
  "Patio",
  "Plant",
  "San Francisco"
];

const images = [
  AbstractThumb,
  BohoHomeThumb,
  BookshelfThumb,
  CoffeeShopThumb,
  ContemporaryThumb,
  CozyHomeThumb,
  DesertThumb,
  FishingThumb,
  FlowerThumb,
  KitchenThumb,
  ModernHomeThumb,
  NatureThumb,
  OceanThumb,
  PatioThumb,
  PlantThumb,
  SanFranciscoThumb
];

const rawImagePaths = [
  Abstract,
  BohoHome,
  Bookshelf,
  CoffeeShop,
  Contemporary,
  CozyHome,
  Desert,
  Fishing,
  Flower,
  Kitchen,
  ModernHome,
  Nature,
  Ocean,
  Patio,
  Plant,
  SanFrancisco
];

const imageElements = new Map();

const getImage = (index: number): Promise<HTMLImageElement> => {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    if (imageElements.has(index)) {
      return resolve(imageElements.get(index));
    }
    const img = new Image();
    img.onload = () => {
      imageElements.set(index, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = rawImagePaths[index];
  });
};

export const backgroundConfig = {
  imageNames,
  images
};

const virtualBackgroundAssets = "/virtualbackground";
let blurProcessor: GaussianBlurBackgroundProcessor;
let virtualBackgroundProcessor: VirtualBackgroundProcessor;

const useBackgroundSettings = (videoTrack: LocalVideoTrack | undefined, room?: Room | null) => {
  const [ backgroundSettings, setBackgroundSettings ] = useState<BackgroundSettings>(() => {
    const localStorageSettings = window.localStorage.getItem(SELECTED_BACKGROUND_SETTINGS_KEY);
    return localStorageSettings ? JSON.parse(localStorageSettings) : { type: "none", index: 0 };
  });

  const removeProcessor = useCallback(() => {
    if (videoTrack && videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
  }, [ videoTrack ]);

  const addProcessor = useCallback(
    (processor: GaussianBlurBackgroundProcessor | VirtualBackgroundProcessor) => {
      if (!videoTrack || videoTrack.processor === processor) {
        return;
      }
      removeProcessor();
      videoTrack.addProcessor(processor);
    },
    [ videoTrack, removeProcessor ]
  );

  useEffect(() => {
    if (!isSupported) {
      return;
    }
    // make sure localParticipant has joined room before applying video processors
    // this ensures that the video processors are not applied on the LocalVideoPreview
    const handleProcessorChange = async () => {
      if (!blurProcessor) {
        blurProcessor = new GaussianBlurBackgroundProcessor({
          assetsPath: virtualBackgroundAssets
        });
        await blurProcessor.loadModel();
      }
      if (!virtualBackgroundProcessor) {
        virtualBackgroundProcessor = new VirtualBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
          backgroundImage: await getImage(0),
          fitType: ImageFit.Cover
        });
        await virtualBackgroundProcessor.loadModel();
      }
      if (!room?.localParticipant) {
        return;
      }

      if (backgroundSettings.type === "blur") {
        addProcessor(blurProcessor);
      } else if (backgroundSettings.type === "image" && typeof backgroundSettings.index === "number") {
        virtualBackgroundProcessor.backgroundImage = await getImage(backgroundSettings.index);
        addProcessor(virtualBackgroundProcessor);
      } else {
        removeProcessor();
      }
    };
    handleProcessorChange();
    window.localStorage.setItem(SELECTED_BACKGROUND_SETTINGS_KEY, JSON.stringify(backgroundSettings));
  }, [ backgroundSettings, videoTrack, room, addProcessor, removeProcessor ]);

  return [ backgroundSettings, setBackgroundSettings ] as const;
};
export default useBackgroundSettings;

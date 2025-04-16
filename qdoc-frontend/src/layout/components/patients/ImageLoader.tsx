import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import { Avatar, Button } from "antd";

const anonymousImg = `${window.origin}/content/anonymous-400.jpg`;

type Props = {
  src?: string;
  size?: number;
  onLoad?: (img) => void;
};

const ImageLoader = ({ src, size = 40, onLoad = () => null }: Props): React.ReactElement => {
  const input = useRef<HTMLInputElement>(null);
  const [ img, setImg ] = useState<string>(anonymousImg);

  useEffect(() => {
    if (!src) {
      onLoad(img);
    }

    return () => {
      setImg(null);
    };
  }, []);

  const handleClick = (): void => input.current.click();

  const handleLoad = (e: ChangeEvent<HTMLInputElement>): void => {
    const file: File = e.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      onLoad(result);
      setImg(result);
    };

    reader.readAsDataURL(file);
  };

  const icon = <span className='icofont icofont-ui-user ml-2' />;

  return (
    <>
      <input ref={input} onChange={handleLoad} type='file' style={{ display: "none" }} />
      <div className='d-flex align-items-center'>
        <Avatar src={src || img} size={size} className='mr-4' />

        <Button type={"primary"} className='btn-outline' onClick={handleClick}>
          Select image {icon}
        </Button>
      </div>
    </>
  );
};

export default ImageLoader;

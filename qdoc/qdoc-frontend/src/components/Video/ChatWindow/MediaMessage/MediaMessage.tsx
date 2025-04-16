import React from "react";
import { Media } from "@twilio/conversations/lib/media";
import { DownloadOutlined } from "@ant-design/icons";

interface MediaMessageProps {
  media: Media;
}

export function formatFileSize(bytes: number, suffixIndex = 0): string {
  const suffixes = [ "bytes", "KB", "MB", "GB" ];
  if (bytes < 1000) return `${+bytes.toFixed(2)} ${suffixes[suffixIndex]}`;
  return formatFileSize(bytes / 1024, suffixIndex + 1);
}

const FileMessage = ({ media }: MediaMessageProps) => {
  const handleClick = () => {
    media.getContentTemporaryUrl().then(url => {
      const anchorEl = document.createElement("a");

      anchorEl.href = url;
      anchorEl.target = "_blank";
      anchorEl.rel = "noopener";

      // setTimeout is needed in order to open files in iOS Safari.
      setTimeout(() => {
        anchorEl.click();
      });
    });
  };

  return (
    <div onClick={handleClick}>
      <div>
        <DownloadOutlined />
      </div>
      <div>
        <p>{media.filename}</p>
        <p>{formatFileSize(media.size)} - Click to open</p>
      </div>
    </div>
  );
};
export default FileMessage;

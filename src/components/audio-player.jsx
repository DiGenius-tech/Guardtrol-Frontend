import React from "react";
import ReactPlayer from "react-player";

const AudioPlayer = ({ url }) => {
  return (
    <div className="w-full min-w-80">
      <ReactPlayer
        url={url}
        playing={false}
        controls={true}
        width="100%"
        height="50px"
        config={{
          file: {
            attributes: {
              preload: "none",
            },
          },
        }}
      />
    </div>
  );
};

export default AudioPlayer;

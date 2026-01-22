import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

export default function VideoPlayer({ data }) {
  if (!data?.url) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No media selected
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black flex flex-col">
      <MediaController className="w-full h-full">
        
        <video
          slot="media"
          src={data.url}
          className="w-full h-full object-contain bg-black"
        />

        <MediaControlBar>
          <MediaPlayButton />
          <MediaSeekBackwardButton seekOffset={10} />
          <MediaSeekForwardButton seekOffset={10} />
          <MediaTimeRange />
          <MediaTimeDisplay showDuration />
          <MediaMuteButton />
          <MediaVolumeRange />
          <MediaPlaybackRateButton />
          <MediaFullscreenButton />
        </MediaControlBar>

      </MediaController>
    </div>
  );
}

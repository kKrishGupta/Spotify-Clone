import { useEffect, useState } from "react";
import Hls from "hls.js";

export function useHlsStream(audioRef, src) {
  const [state, setState] = useState({ supported: true, buffering: false, level: "Auto" });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) {
      return undefined;
    }

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hls.loadSource(src);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setState({ supported: true, buffering: false, level: `${data.levels.length} variants` });
      });
      hls.on(Hls.Events.BUFFER_STALLED, () => setState((current) => ({ ...current, buffering: true })));
      hls.on(Hls.Events.BUFFER_APPENDED, () => setState((current) => ({ ...current, buffering: false })));
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = src;
      setState({ supported: true, buffering: false, level: "Native HLS" });
    } else {
      setState({ supported: false, buffering: false, level: "Unsupported" });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [audioRef, src]);

  return state;
}

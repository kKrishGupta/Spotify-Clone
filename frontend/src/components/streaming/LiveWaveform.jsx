import { Waveform } from "@/features/streaming/waveform/Waveform";

export function LiveWaveform() {
  return <Waveform active bars={64} />;
}

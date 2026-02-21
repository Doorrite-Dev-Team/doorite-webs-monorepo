import { toast } from "@repo/ui/components/sonner";

type SoundType = "order-placed" | "alert" | "success" | "pop";

const SOUNDS: Record<SoundType, string> = {
  "order-placed": "/sounds/ringtone_loop.mp3", // Long ringing for orders
  alert: "/sounds/alert.mp3",
  success: "/sounds/coins.mp3",
  pop: "/sounds/pop.mp3",
};

export const playSound = (type: SoundType) => {
  if (typeof window === "undefined") return;

  const audio = new Audio(SOUNDS[type]);

  // // New Order sounds should loop until interactions
  // if (type === "order-placed") {
  //   audio.loop = true;
  //   // We return the audio instance for the caller to stop it later
  //   return audio;
  // }

  audio.play().catch((err) => {
    const message = `Audio playback failed (interaction required):" ${err}`;
    console.warn(message);
    toast.error("Audio PlayBack Failed", { description: message });
  });

  return audio;
};

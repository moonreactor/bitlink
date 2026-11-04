"use client";

import { useEffect, useRef, useState } from "react";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          width?: number | string;
          height?: number | string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
            onError?: () => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

export function BackgroundMusicPlayer({ videoId }: { videoId: string }) {
  const playerRef = useRef<YTPlayer | null>(null);
  // Stable across SSR/CSR to avoid hydration mismatches
  const containerId = `yt-bg-${videoId}`;
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    async function setup() {
      try {
        await loadYouTubeApi();
        if (cancelled || !window.YT?.Player) return;

        playerRef.current?.destroy();
        playerRef.current = new window.YT.Player(containerId, {
          videoId,
          width: 1,
          height: 1,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: videoId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              event.target.setVolume(70);
              event.target.unMute();
              event.target.playVideo();
              setReady(true);
              // Browsers often block unmuted autoplay — fall back to muted or wait for tap
              window.setTimeout(() => {
                if (cancelled || !playerRef.current) return;
                const state = playerRef.current.getPlayerState();
                const playingNow = state === window.YT?.PlayerState.PLAYING;
                if (!playingNow) {
                  try {
                    playerRef.current.mute();
                    playerRef.current.playVideo();
                    setMuted(true);
                    setNeedsGesture(true);
                  } catch {
                    setNeedsGesture(true);
                  }
                } else {
                  setPlaying(true);
                  setMuted(playerRef.current.isMuted());
                }
              }, 600);
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const isPlaying = event.data === window.YT?.PlayerState.PLAYING;
              setPlaying(Boolean(isPlaying));
              if (isPlaying) setNeedsGesture(false);
              if (event.data === window.YT?.PlayerState.ENDED) {
                event.target.playVideo();
              }
            },
            onError: () => {
              if (!cancelled) setFailed(true);
            },
          },
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    setup();

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [mounted, videoId, containerId]);

  function togglePlay() {
    const player = playerRef.current;
    if (!player) return;
    if (playing) {
      player.pauseVideo();
      setPlaying(false);
    } else {
      player.playVideo();
      setPlaying(true);
      setNeedsGesture(false);
    }
  }

  function toggleMute() {
    const player = playerRef.current;
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
      player.setVolume(70);
      setMuted(false);
      if (!playing) {
        player.playVideo();
        setPlaying(true);
      }
      setNeedsGesture(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }

  if (!mounted || failed) return null;

  return (
    <>
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden>
        <div id={containerId} />
      </div>

      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-2 py-2 text-white shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-semibold transition hover:bg-white/25 disabled:opacity-40"
          aria-label={playing ? "Pause music" : "Play music"}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          disabled={!ready}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-base transition hover:bg-white/25 disabled:opacity-40"
          aria-label={muted ? "Unmute music" : "Mute music"}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
        {needsGesture && (
          <button
            type="button"
            onClick={() => {
              const player = playerRef.current;
              if (!player) return;
              player.unMute();
              player.setVolume(70);
              player.playVideo();
              setMuted(false);
              setPlaying(true);
              setNeedsGesture(false);
            }}
            className="mr-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/30"
          >
            Tap to play music
          </button>
        )}
      </div>
    </>
  );
}

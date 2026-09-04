"use client";

import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import { mediaUrl } from "@/lib/media";
import type { AdVideo } from "@/types/domain";

/** How many seconds the visitor must wait before they can close the popup. */
const SKIP_AFTER_SECONDS: number = 5;

type PopupVideo = {
  id: string;
  src: string;
  poster: string | null;
  title: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

function toPopupVideo(video: AdVideo): PopupVideo | null {
  const src = mediaUrl(video.media);
  if (!src) return null;
  return {
    id: video.id,
    src,
    poster: mediaUrl(video.poster_media),
    title: video.title,
    ctaLabel: video.cta_label,
    ctaHref: video.cta_href,
  };
}

export function AdPopup({ videos }: { videos: AdVideo[] }) {
  const [video, setVideo] = useState<PopupVideo | null>(null);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(SKIP_AFTER_SECONDS);
  const [canClose, setCanClose] = useState(SKIP_AFTER_SECONDS === 0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pick a video and show it, once, on mount.
  useEffect(() => {
    const playable = videos.map(toPopupVideo).filter((v): v is PopupVideo => v !== null);
    if (playable.length === 0) return;

    const chosen = playable[Math.floor(Math.random() * playable.length)];

    const timer = setTimeout(() => {
      setVideo(chosen);
      setOpen(true);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown before the visitor is allowed to close/skip.
  useEffect(() => {
    if (!open || canClose) return;
    if (secondsLeft <= 0) {
      setCanClose(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [open, secondsLeft, canClose]);

  // Lock background scroll while the popup is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Allow Escape to close once skipping is permitted.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && canClose) handleClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, canClose]);

  function handleClose() {
    setOpen(false);
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  }

  function handleVideoError() {
    // If the video can't play for any reason, don't trap the visitor.
    setCanClose(true);
  }

  if (!open || !video) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title ?? "Advertisement"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-public-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && canClose) handleClose();
      }}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-public-black shadow-2xl">
        {/* Close / skip control */}
        <div className="absolute right-3 top-3 z-10">
          {canClose ? (
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close ad"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-public-black/70 text-public-white transition hover:bg-public-black"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex h-9 items-center justify-center rounded-full bg-public-black/70 px-3 text-sm font-medium text-public-white/90">
              Skip in {secondsLeft}s
            </div>
          )}
        </div>

        {/* Mute toggle */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-public-black/70 text-public-white transition hover:bg-public-black"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        <video
          ref={videoRef}
          key={video.id}
          src={video.src}
          poster={video.poster ?? undefined}
          className="aspect-video w-full bg-public-black object-contain"
          autoPlay
          muted={muted}
          playsInline
          controls={false}
          onError={handleVideoError}
          onEnded={() => setCanClose(true)}
        />

        {(video.title || video.ctaLabel) && (
          <div className="flex flex-col gap-3 border-t border-public-white/10 bg-public-black p-4 sm:flex-row sm:items-center sm:justify-between">
            {video.title && (
              <p className="text-sm text-public-white/80">{video.title}</p>
            )}
            {video.ctaLabel && video.ctaHref && (
              <a
                href={video.ctaHref}
                onClick={handleClose}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-public-white px-5 py-2 text-sm font-semibold text-public-black transition hover:bg-public-white/90"
              >
                {video.ctaLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

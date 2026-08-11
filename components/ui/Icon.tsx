import type { ReactNode } from "react";
import type { IconName } from "@/types/blocks";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

/**
 * SVG-paden letterlijk overgenomen uit _reference/. "photo" en "gallery"
 * zijn allebei een landschap-icoon maar met net iets andere coördinaten:
 * "photo" komt uit home's werkwijze-stap "Oplevering", "gallery" uit
 * fotografie's voordeel "Volledige reportage".
 */
const paths: Record<IconName, ReactNode> = {
  camera: (
    <>
      <path d="M14.5 4h-5L8 6.5H4.5A1.5 1.5 0 0 0 3 8v10a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 18V8a1.5 1.5 0 0 0-1.5-1.5H16z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  video: (
    <>
      <rect x="2" y="6" width="13" height="12" rx="1.5" />
      <path d="M15 10.5 22 7v10l-7-3.5z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.7l5.9-.8z" />,
  eye: (
    <>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7.5 2.9c0 5-7.5 9.4-7.5 9.4z" />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </>
  ),
  photo: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m3 15 5-4 4 3 3.5-3L21 15" />
      <circle cx="8.5" cy="8.5" r="1.4" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 16 4.5-3.5L11 15l3-2.5L21 17" />
      <circle cx="8.2" cy="9.2" r="1.3" />
    </>
  ),
  chat: <path d="M20 15.5a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />,
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
    </>
  ),
  "calendar-check": (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3M9 15l2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2V12l3.2 1.9" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5z" />
    </>
  ),
};

export default function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

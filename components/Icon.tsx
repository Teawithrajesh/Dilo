// Small line icons (24×24, stroke = currentColor). Decorative unless a label is given.
const paths = {
  dream: "M12 3l1.9 4.6L19 8.2l-3.8 3.4 1.1 5L12 14l-4.3 2.6 1.1-5L5 8.2l5.1-.6z",
  share: "M8 12a3 3 0 1 1 0-.01M16 6a3 3 0 1 1 0-.01M16 18a3 3 0 1 1 0-.01M10.7 10.7l2.6-3.4M10.7 13.3l2.6 3.4",
  support: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  celebrate: "M4 20l4-12 8 8-12 4zM14 4l1 2M19 5l-2 1.5M20 10h-2.5M12 9l3-3",
  shield: "M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z M9 12l2 2 4-4",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",
  check: "M5 12l5 5L19 7",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c0-3.9 3.1-7 7-7s7 3.1 7 7M16 3.5a4 4 0 0 1 0 7.5M18 14c2.4.7 4 3 4 7",
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  x: "M6 6l12 12M18 6L6 18",
  arrow: "M5 12h14M13 6l6 6-6 6",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  chevron: "M6 9l6 6 6-6",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  swap: "M7 7h13l-4-4M17 17H4l4 4",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-6 w-6", label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={paths[name]} />
    </svg>
  );
}

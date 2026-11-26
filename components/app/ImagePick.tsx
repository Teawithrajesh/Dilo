"use client";

import { useId, useState } from "react";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * A button that picks one image and hands back a local preview link (blob:).
 * The file stays on the phone; nothing is uploaded in the demo.
 */
export function ImagePick({
  label,
  onPick,
  className = "",
  testId,
  children,
}: {
  label: string;
  onPick: (url: string) => void;
  className?: string;
  testId?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);

  function change(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) return setError("Please choose a JPG, PNG or WebP image.");
    if (file.size > MAX_IMAGE_BYTES) return setError("That image is over 5 MB. Please choose a smaller one.");
    setError(null);
    onPick(URL.createObjectURL(file));
  }

  return (
    <>
      <label htmlFor={id} aria-label={label} className={`cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-white ${className}`}>
        {children}
        <input id={id} data-testid={testId} type="file" accept={IMAGE_TYPES.join(",")} onChange={change} className="sr-only" />
      </label>
      {error && <span role="alert" className="mt-2 block text-small text-[#ffd0da]">{error}</span>}
    </>
  );
}

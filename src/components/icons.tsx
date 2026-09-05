// Small hand-authored inline SVG icon set — replaces the old Font Awesome
// kit-loader script (a ~4KB third-party runtime blob) with a handful of
// static paths that ship for free with the rest of the bundle.
type IconProps = { className?: string };

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.82 0H1.18C.53 0 0 .52 0 1.16v13.68C0 15.48.53 16 1.18 16h13.64c.65 0 1.18-.52 1.18-1.16V1.16C16 .52 15.47 0 14.82 0ZM4.75 13.63H2.38V6h2.37v7.63ZM3.56 4.96c-.76 0-1.38-.62-1.38-1.38 0-.76.62-1.37 1.38-1.37.76 0 1.38.61 1.38 1.37 0 .76-.62 1.38-1.38 1.38Zm10.07 8.67h-2.37V9.92c0-.86-.02-1.97-1.2-1.97-1.21 0-1.39.94-1.39 1.91v3.77H6.3V6h2.28v1.04h.03c.32-.6 1.09-1.22 2.24-1.22 2.39 0 2.83 1.57 2.83 3.62v4.19Z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 8.05C16 3.6 12.42 0 8 0S0 3.6 0 8.05c0 4.02 2.93 7.35 6.75 7.95v-5.62H4.72V8.05h2.03V6.28c0-2.02 1.19-3.14 3.02-3.14.87 0 1.79.16 1.79.16v1.98h-1.01c-1 0-1.31.62-1.31 1.27v1.5h2.23l-.36 2.33H9.24V16C13.07 15.4 16 12.07 16 8.05Z" />
    </svg>
  );
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      <rect x="1" y="3" width="14" height="10" rx="1.5" />
      <path d="M1.5 4 8 9.5 14.5 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RssIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="3.2" cy="12.8" r="1.8" />
      <path d="M1 6.6a8.4 8.4 0 0 1 8.4 8.4h2.4A10.8 10.8 0 0 0 1 4.2v2.4Z" />
      <path d="M1 1a15 15 0 0 1 15 15h-2.4A12.6 12.6 0 0 0 1 3.4V1Z" />
    </svg>
  );
}

/** A little crate/box glyph — stands in for a screenshot on library-style Garage entries. */
export function CrateIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 11 L16 5 L28 11 L16 17 Z" />
      <path d="M4 11 V23 L16 29 V17" />
      <path d="M28 11 V23 L16 29" />
      <path d="M10 8 L22 14" opacity="0.5" />
    </svg>
  );
}

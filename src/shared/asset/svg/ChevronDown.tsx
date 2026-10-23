interface ChevronDownProps {
  className?: string;
}

export default function ChevronDown({ className = "" }: ChevronDownProps) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M5 8L10 13L15 8" fill="currentColor" />
    </svg>
  );
}

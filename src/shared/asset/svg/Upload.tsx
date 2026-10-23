interface UploadProps {
  className?: string;
}

export default function Upload({ className = "" }: UploadProps) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.95833 8.66667V4.25208L4.55 5.66042L3.79167 4.875L6.5 2.16667L9.20833 4.875L8.45 5.66042L7.04167 4.25208V8.66667H5.95833ZM3.25 10.8333C2.95208 10.8333 2.69714 10.7273 2.48517 10.5154C2.27319 10.3034 2.16703 10.0483 2.16667 9.75V8.125H3.25V9.75H9.75V8.125H10.8333V9.75C10.8333 10.0479 10.7273 10.303 10.5154 10.5154C10.3034 10.7277 10.0483 10.8337 9.75 10.8333H3.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

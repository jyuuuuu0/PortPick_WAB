interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <p
      className={`font-asimovian text-main-200 text-[40px] leading-none ${className}`}
    >
      PortPick
    </p>
  );
}

import DefaultAvatar from "@/shared/asset/svg/DefaultAvatar";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

/** 프로필 이미지. 이미지가 없으면 기본 아바타를 보여준다. */
export default function Avatar({ src, alt = "", className = "size-8" }: AvatarProps) {
  return (
    <span className={`inline-block shrink-0 rounded-full overflow-hidden ${className}`}>
      {src ? (
        // 외부(구글/S3) 이미지라 next/image 대신 img 를 쓴다.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <DefaultAvatar className="size-full" />
      )}
    </span>
  );
}

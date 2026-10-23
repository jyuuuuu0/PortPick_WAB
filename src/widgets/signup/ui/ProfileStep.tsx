import DefaultAvatar from "@/shared/asset/svg/DefaultAvatar";
import Upload from "@/shared/asset/svg/Upload";
import Logo from "@/shared/ui/Logo";
import { useRef } from "react";

interface ProfileStepProps {
  name: string;
  profileImage: string;
  onSelectImage: (previewUrl: string) => void;
  onComplete: () => void;
  onSkip: () => void;
}

/**
 * 회원가입 3단계 - 프로필 이미지 업로드. 업로드 후 완료하거나 건너뛸 수 있다.
 */
export default function ProfileStep({
  name,
  profileImage,
  onSelectImage,
  onComplete,
  onSkip,
}: ProfileStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onSelectImage(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full text-center">
      <Logo />
      <p className="text-base">
        <span className="text-main-300">{name || "회원"}</span>님의 프로필을
        업로드해주세요!
      </p>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="프로필 이미지 선택"
          className="size-[60px] rounded-full overflow-hidden cursor-pointer"
        >
          {profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileImage}
              alt="프로필 미리보기"
              className="size-full object-cover"
            />
          ) : (
            <DefaultAvatar className="size-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2 py-1 rounded-[8px] bg-main-100 text-[10px] text-gray-800 hover:brightness-95 transition cursor-pointer"
        >
          <Upload className="w-[13px] h-[13px]" />
          프로필 업로드
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="flex gap-4 w-full">
        <button
          type="button"
          onClick={onComplete}
          className="flex-1 h-[34px] rounded-[8px] bg-main-200 text-xs font-medium text-black hover:bg-main-300 transition-colors cursor-pointer"
        >
          완료하기
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="flex-1 h-[34px] rounded-[8px] bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}

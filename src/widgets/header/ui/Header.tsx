"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuthStatus, useLogout, useMyProfile } from "@/entities/user";
import Avatar from "@/shared/ui/Avatar";

/**
 * 메인 화면 상단 헤더 (피그마 Frame 4 기준).
 * 왼쪽 로고, 오른쪽에 로그인 버튼 또는 프로필 메뉴.
 */
export default function Header() {
  const router = useRouter();
  const { data: auth } = useAuthStatus();
  const isMember = !!auth?.authenticated && !!auth.signupCompleted;
  const { data: profile } = useMyProfile(isMember);
  const logout = useLogout();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 구글 로그인만 하고 가입을 마치지 않은 사용자는 가입 화면으로 보낸다.
  useEffect(() => {
    if (auth?.authenticated && !auth.signupCompleted) router.replace("/signup");
  }, [auth, router]);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => router.replace("/") });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 dark:bg-[#121212]/90 backdrop-blur">
      <div className="max-w-[1260px] mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="font-asimovian text-main-200 text-[28px] leading-none">
          PortPick
        </Link>

        {isMember ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="내 메뉴"
              className="flex rounded-full cursor-pointer ring-main-200 hover:ring-2 transition"
            >
              <Avatar src={profile?.profileImageUrl} className="size-9" />
            </button>
            {open && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+8px)] w-44 rounded-[10px] border border-gray-200 bg-white dark:bg-[#2A2A2A] p-1 shadow-[0_8px_20px_0_rgba(0,0,0,0.12)]"
              >
                <p className="px-3 py-2 text-xs text-gray-500 truncate">
                  {profile?.name ?? auth?.name}
                </p>
                <Link
                  role="menuitem"
                  href="/mypage"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-[6px] text-sm hover:bg-main-100 dark:hover:bg-gray-200"
                >
                  마이페이지
                </Link>
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="w-full text-left px-3 py-2 rounded-[6px] text-sm text-gray-700 hover:bg-main-100 dark:hover:bg-gray-200 cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/signin"
            className="rounded-[8px] bg-main-300 px-4 py-2 text-sm font-medium text-white hover:bg-main-400 transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

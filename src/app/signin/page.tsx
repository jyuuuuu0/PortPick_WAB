import { Suspense } from "react";
import SigninView from "@/views/signin/ui/SigninView";

export default function SigninPage() {
  // useSearchParams 를 쓰는 클라이언트 컴포넌트는 Suspense 로 감싸야 빌드된다.
  return (
    <Suspense>
      <SigninView />
    </Suspense>
  );
}

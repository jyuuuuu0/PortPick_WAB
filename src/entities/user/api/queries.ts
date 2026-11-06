import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthStatus, getMyProfile, logout } from "./userApi";

export const userKeys = {
  auth: ["auth", "me"] as const,
  profile: ["profile", "me"] as const,
};

export function useAuthStatus() {
  return useQuery({ queryKey: userKeys.auth, queryFn: getAuthStatus });
}

export function useMyProfile(enabled = true) {
  return useQuery({ queryKey: userKeys.profile, queryFn: getMyProfile, enabled });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    // clear() 는 화면에 떠 있는 쿼리를 다시 불러오지 않아 이전 로그인 상태가 남는다.
    // resetQueries 로 초기화하면서 보이는 쿼리를 다시 불러온다.
    onSettled: () => queryClient.resetQueries(),
  });
}

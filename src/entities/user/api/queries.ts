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
    onSettled: () => queryClient.clear(),
  });
}

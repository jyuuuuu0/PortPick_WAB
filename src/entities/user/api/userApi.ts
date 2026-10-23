import { api, isUnauthorized } from "@/shared/api/client";
import type { AuthStatus, Profile, ProfileUpsert } from "../model/types";

/** 로그인 상태 조회. 비로그인(401)은 에러가 아니라 authenticated: false 로 돌려준다. */
export async function getAuthStatus(): Promise<AuthStatus> {
  try {
    const { data } = await api.get<AuthStatus>("/auth/me");
    return data;
  } catch (error) {
    if (isUnauthorized(error)) return { authenticated: false };
    throw error;
  }
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function getMyProfile() {
  const { data } = await api.get<Profile>("/profile/me");
  return data;
}

function toFormData(input: ProfileUpsert) {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("noOrganization", String(input.noOrganization));
  if (input.organizationName) formData.append("organizationName", input.organizationName);
  formData.append("jobRole", input.jobRole);
  formData.append("careerType", input.careerType);
  if (input.careerRange) formData.append("careerRange", input.careerRange);
  if (input.profileImage) formData.append("profileImage", input.profileImage);
  if (input.deleteProfileImage) formData.append("deleteProfileImage", "true");
  return formData;
}

export async function completeSignup(input: ProfileUpsert) {
  const { data } = await api.post<Profile>("/profile/signup", toFormData(input));
  return data;
}

export async function updateMyProfile(input: ProfileUpsert) {
  const { data } = await api.put<Profile>("/profile/me", toFormData(input));
  return data;
}

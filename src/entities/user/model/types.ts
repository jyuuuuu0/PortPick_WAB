export interface AuthStatus {
  authenticated: boolean;
  email?: string;
  name?: string;
  provider?: string;
  signupCompleted?: boolean;
}

export interface Profile {
  email: string;
  name: string;
  organizationName?: string;
  noOrganization?: boolean;
  jobRole?: string;
  careerType?: string;
  careerRange?: string;
  profileImageUrl?: string;
  customProfileImage?: boolean;
  signupCompleted: boolean;
}

export interface ProfileUpsert {
  name: string;
  organizationName?: string;
  noOrganization: boolean;
  jobRole: string;
  careerType: string;
  careerRange?: string;
  profileImage?: File | null;
  deleteProfileImage?: boolean;
}

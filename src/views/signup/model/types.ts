export interface SignupForm {
  name: string;
  workplace: string;
  jobGroup: string;
  careerType: string;
  careerYears: string;
  /** 미리보기용 object URL */
  profileImage: string;
  /** 서버로 보낼 실제 파일 */
  profileImageFile: File | null;
}

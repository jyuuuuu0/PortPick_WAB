export interface CommentAuthor {
  id: number;
  name: string;
  profileImageUrl?: string;
}

export interface Reply {
  id: number;
  content: string;
  author: CommentAuthor;
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  xPercent: number;
  yPercent: number;
  resolved: boolean;
  author: CommentAuthor;
  replies: Reply[];
  createdAt: string;
}

export interface CommentCreate {
  content: string;
  xPercent: number;
  yPercent: number;
}

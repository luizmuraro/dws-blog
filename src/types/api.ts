export interface ApiAuthor {
  id: string;
  name: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
}

export interface ApiPost {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  categories: ApiCategory[];
  author: ApiAuthor;
}

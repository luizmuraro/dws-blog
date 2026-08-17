export interface Author {
  id: string;
  name: string;
  profilePicture: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  paragraphs: string[];
  thumbnailUrl: string;
  publishedAt: string;
  author: Author;
  categories: Category[];
}

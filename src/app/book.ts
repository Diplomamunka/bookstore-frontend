import {Author} from "./author";
import {Category} from "./category";

export interface Book {
  id?: bigint;
  title: string;
  price: number;
  authors: Author[];
  category: Category;
  shortDescription?: string;
  discount: number;
  available: boolean;
  releaseDate?: Date;
  tags: string[];
  image?: string;
}


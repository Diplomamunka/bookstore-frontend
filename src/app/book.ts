import {Author} from "./author";
import {Category} from "./category";

export interface Book {
  id: bigint;
  title: string;
  price: number;
  authors: Author[];
  category: Category;
  short_description?: string;
  discount: number;
  is_available: boolean;
  release_date?: Date;
  tags?: string[];
  image?: string;
}

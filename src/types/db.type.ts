export interface Book {
  _id?: string;
  author: string;
  created_at?: number;
  created_by?: string;
  creator_secret?: string;
  page_count: string;
  rating?: number;
  title: string;
  rider?: string;
  updated_at?: number;
  updated_by?: string;
  word_count?: number;
}

export type SchemaDefinition =
  | NumberConstructor
  | StringConstructor
  | {
      type: StringConstructor | NumberConstructor;
      select?: boolean;
      required?: boolean;
      unique?: boolean;
    };

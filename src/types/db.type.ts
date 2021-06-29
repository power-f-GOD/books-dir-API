import { SchemaTypeOptions } from 'mongoose';

export interface Book {
  _id?: string;
  author: string;
  created_at?: number;
  created_by?: string | null;
  creator_secret?: string | null;
  mandate_update_with_secret?: boolean;
  page_count: string;
  rating?: number;
  ratings?: number[];
  ratings_count?: number;
  title: string;
  rider?: string | null;
  updated_at?: number | null;
  updated_by?: string | null;
  word_count?: number | null;
}

export type SchemaTypes =
  | [StringConstructor]
  | [NumberConstructor]
  | BooleanConstructor
  | NumberConstructor
  | StringConstructor
  | null;

export type SchemaStruct =
  | SchemaTypes
  | SchemaTypeOptions<SchemaTypes | boolean | number>;

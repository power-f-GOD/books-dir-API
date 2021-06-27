import { Book } from 'src/types';
import BaseDB from './base.db';

class BooksDB extends BaseDB<Book> {
  constructor() {
    super('Books', {
      author: { type: String, required: true },
      created_at: Number,
      created_by: String,
      creator_secret: { type: String, select: false },
      page_count: { type: Number, required: true },
      rating: Number,
      rider: String,
      title: { type: String, required: true },
      updated_at: Number,
      updated_by: String,
      word_count: Number
    });
  }

  async getByTitle(title: string): Promise<Book | null> {
    return await this.ContextModel.findOne({ title });
  }

  async getByAuthor(author: string): Promise<Book | null> {
    return await this.ContextModel.findOne({ author });
  }

  async getAllByAuthor(author: string): Promise<Book | null> {
    return await this.ContextModel.find({ author });
  }
}

export default new BooksDB();

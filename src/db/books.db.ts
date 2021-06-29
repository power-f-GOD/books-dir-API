import { Book } from 'src/types';
import BaseDB from './base.db';

class BooksDB extends BaseDB<Book> {
  constructor() {
    super('Books', {
      author: {
        type: String,
        required: [true, "Missing property, 'author', is required."]
      },
      created_at: { type: Number, immutable: true },
      created_by: { type: String, default: null },
      creator_secret: {
        type: String,
        select: false,
        default: null,
        required: [
          function () {
            //@ts-ignore
            return this.mandate_update_with_secret;
          },
          "You must provide a 'creator_secret' if you must set the 'mandate_update_with_secret' prop."
        ]
      },
      mandate_update_with_secret: {
        type: Boolean,
        default: false,
        select: false
      },
      page_count: {
        type: Number,
        required: [true, "Missing property, 'page_count', is required."],
        validate: {
          validator: function (value: number) {
            return value > 15;
          } as any,
          message: "Page count less than 16 pages? That can't be a book."
        }
      },
      rating: {
        type: Number,
        default: 5,
        validate: {
          validator: function (value: number) {
            return value <= 5 && value >= 1;
          } as any,
          message:
            'Invalid rating value, {VALUE}. Value should be between 1 and 5.'
        }
      },
      ratings_count: { type: Number, default: 0 },
      ratings: {
        type: [Number] as any,
        enum: [1, 2, 3, 4, 5],
        select: false
      },
      rider: { type: String, default: null },
      title: {
        type: String,
        required: [true, "Missing property, 'title', is required."]
      },
      updated_at: { type: Number, default: null },
      updated_by: { type: String, default: null },
      word_count: { type: Number, default: null }
    });
  }

  async getByTitle(title: string) {
    return await this.ContextModel.findOne({ title });
  }

  async getByAuthor(author: string) {
    return await this.ContextModel.findOne({ author });
  }

  async getAllByAuthor(author: string) {
    return await this.ContextModel.find({ author });
  }

  async getByIdWithSecret(_id: string) {
    return await this.ContextModel.findOne({ _id }).select(
      '+creator_secret +mandate_update_with_secret'
    );
  }

  async getByIdWithRatings(_id: string) {
    return await this.ContextModel.findById(_id).select('+ratings');
  }
}

export default new BooksDB();

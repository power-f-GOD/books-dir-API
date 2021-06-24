import { Book } from './types/books.type';

export default class Database {
  private static records: Book[] = [];

  static async get(limit?: number, offset?: number): Promise<Book[]> {
    return Promise.resolve(Database.records);
  }

  static async create(resource: Book): Promise<Book> {
    Database.records.push(resource);
    return Promise.resolve(resource);
  }

  static async deleteById(id: string): Promise<string | null> {
    const recordIndex = Database.records.findIndex(
      (record) => record.id === id
    );

    if (recordIndex < 0) {
      return Promise.resolve(null);
    }

    Database.records.splice(recordIndex, 1);
    return Promise.resolve('Record deleted!');
  }

  static async getById(id: string): Promise<Book | null> {
    return Promise.resolve(
      Database.records.find((record) => record.id === id) || null
    );
  }

  static async getByTitle(title: string): Promise<Book | null> {
    return Promise.resolve(
      Database.records.find((record) => record.title === title) || null
    );
  }

  static async getByAuthor(author: string): Promise<Book | null> {
    return Promise.resolve(
      Database.records.find((record) => record.author === author) || null
    );
  }

  static async putById(id: string, resource: Book): Promise<Book | null> {
    const recordIndex = Database.records.findIndex(
      (record) => record.id === id
    );

    if (recordIndex < 0) {
      return Promise.resolve(null);
    }

    Database.records[recordIndex] = resource;
    return Promise.resolve(resource);
  }

  static async patchById(
    id: string,
    resource: Partial<Book>
  ): Promise<Book | null> {
    const recordIndex = Database.records.findIndex(
      (record) => record.id === id
    );

    if (recordIndex < 0) {
      return Promise.resolve(null);
    }

    Database.records[recordIndex] = {
      ...Database.records[recordIndex],
      ...resource
    };
    return Promise.resolve(Database.records[recordIndex]);
  }
}

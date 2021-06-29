import { Schema, Model, Document, FilterQuery } from 'mongoose';
import { MongooseService } from 'src/services';
import { SchemaStruct, Book } from 'src/types';

export default abstract class BaseDB<DBDocType> {
  Schema: typeof Schema;
  private contextSchema: Schema<DBDocType>;
  ContextModel: Model<DBDocType, Document<DBDocType>>;
  private collectionName: string;

  constructor(
    collectionName: string,
    schemaDefinition: Record<keyof Omit<DBDocType, '_id'>, SchemaStruct>
  ) {
    this.Schema = MongooseService.mongoose.Schema;
    this.contextSchema = new this.Schema<DBDocType>(schemaDefinition);
    this.collectionName = collectionName;
    this.ContextModel = MongooseService.mongoose.model<
      DBDocType,
      Model<DBDocType, Document<DBDocType>>
    >(this.collectionName, this.contextSchema);
  }

  async getAll(limit?: number, page?: number) {
    return await this.ContextModel.find()
      .limit(limit || 10)
      .skip(page || 0);
  }

  async getById(_id: string) {
    return await this.ContextModel.findById(_id);
  }

  async create(resource: DBDocType) {
    return await new this.ContextModel(resource).save();
  }

  async deleteOne(_id: string) {
    return await this.ContextModel.deleteOne({ _id } as FilterQuery<any>);
  }

  async updateOne(_id: string, resource: Partial<DBDocType>) {
    return await this.ContextModel.updateOne(
      { _id } as FilterQuery<any>,
      resource as any,
      { new: true, runValidators: true, context: 'query' }
    );
  }
}

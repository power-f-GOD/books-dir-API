import { Schema, Model, Document, FilterQuery, SaveOptions } from 'mongoose';
import { MongooseService } from 'src/services';
import { SchemaDefinition } from 'src/types';

export default abstract class BaseDB<DocType = any> {
  Schema: typeof Schema;
  private contextSchema: Schema<DocType>;
  ContextModel: Model<DocType, any, any>;
  private collectionName: string;

  constructor(
    collectionName: string,
    schemaDefinition: Record<keyof Omit<DocType, '_id'>, SchemaDefinition>
  ) {
    this.Schema = MongooseService.mongoose.Schema;
    this.contextSchema = new this.Schema<DocType>(schemaDefinition);
    this.collectionName = collectionName;
    this.ContextModel = MongooseService.mongoose.model<
      DocType,
      Model<DocType, Document<DocType, any>>
    >(this.collectionName, this.contextSchema);
  }

  async getAll(limit?: number, offset?: number): Promise<DocType[]> {
    return await this.ContextModel.find();
  }

  async getById(_id: string): Promise<DocType | null> {
    return await this.ContextModel.findById(_id);
  }

  async create(resource: DocType): Promise<DocType> {
    return await new this.ContextModel(resource).save();
  }

  async deleteOne(_id: string): Promise<string | null> {
    return await this.ContextModel.deleteOne({ _id } as FilterQuery<any>);
  }

  async updateOne(
    _id: string,
    resource: Partial<DocType>
  ): Promise<DocType | null> {
    return await this.ContextModel.updateOne(
      { _id } as FilterQuery<any>,
      resource as any
    );
  }
}

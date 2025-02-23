import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

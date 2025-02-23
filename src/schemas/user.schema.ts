import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: false, default: null })
  firstName: string;
  @Prop({ type: String, required: false, default: null })
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

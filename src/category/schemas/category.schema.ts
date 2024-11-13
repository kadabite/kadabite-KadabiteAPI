import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@MongooseSchema()
export class Category {
  @Prop({ required: true, unique: true, maxlength: 100 })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// export const Category = mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);

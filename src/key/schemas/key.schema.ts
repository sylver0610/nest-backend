import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
export type KeyDocument = HydratedDocument<Key>;

@Schema({
    timestamps: true,
})
export class Key {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ required: true })
    publicKey: string;

    @Prop({ required: true })
    privateKey: string;

    @Prop({ type: Array })
    refreshTokensUsed: Array<string>;

    @Prop({ required: true })
    refreshToken: string;
}

export const KeySchema = SchemaFactory.createForClass(Key);

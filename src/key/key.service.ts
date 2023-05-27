import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { Key } from './schemas/key.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateKeyDto, RemoveKeyDto } from './dto/key.dto';
import { randomBytes } from 'crypto';
@Injectable()
export class KeyService {
    constructor(
        @InjectModel(Key.name)
        private keyModel: mongoose.Model<Key>,
        private jwtService: JwtService,
    ) {}

    //create random key 64 byte
    CreateRandomKey() {
        return randomBytes(64).toString('hex');
    }

    //Create accessToken and refreshToken
    async createTokenPair(payload: object, publicKey: string, privateKey: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const accessToken = await this.jwtService.signAsync(payload, {
                secret: publicKey,
                expiresIn: process.env.EXPIRESIN_ACCESSTOKEN,
            });
            const refreshToken = await this.jwtService.signAsync(payload, {
                secret: privateKey,
                expiresIn: process.env.EXPIRESIN_REFRESHTOKEN,
            });
            // console.log(
            //     this.jwtService.verifyAsync(accessToken, {
            //         secret: publicKey,
            //     }),
            // );
            return { accessToken, refreshToken };
        } catch (error) {
            return error;
        }
    }

    //save payload to database
    async createKeyToken(payload: CreateKeyDto) {
        try {
            //version 1
            // const tokens = await this.keyModel.create({
            //     user: payload.user,
            //     publicKey: payload.publicToken,
            //     privateKey: payload.privateToken,
            // });
            // return tokens ? tokens.publicKey : null;

            //version 2
            const filter = {
                user: payload.user,
            };
            const update = {
                // user: payload.user,
                publicKey: payload.publicToken,
                privateKey: payload.privateToken,
                refreshTokensUsed: [],
                refreshToken: payload.refreshToken,
            };
            const options = {
                upsert: true,
                new: true,
            };
            const tokens = await this.keyModel.findOneAndUpdate(filter, update, options);
            // console.log(`tokens ${tokens}`);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    async removeKeyTokenById(user: RemoveKeyDto) {
        // console.log(user);
        return await this.keyModel.deleteOne({
            _id: user,
        });
    }

    //find user by id
    async findUserById(userId: string) {
        return await this.keyModel.findOne({ user: new Types.ObjectId(userId) });
    }

    async findByRefreshTokenUsed(refreshToken: string) {
        return await this.keyModel
            .findOne({
                refreshTokensUsed: refreshToken,
            })
            .lean();
    }

    async findByRefreshToken(refreshToken: string) {
        // console.log(typeof refreshToken, 'service');
        return await this.keyModel.findOne({
            refreshToken: refreshToken,
        });
    }

    //by userid
    async deleteKeyById(userId: object) {
        return await this.keyModel.deleteOne({
            user: userId,
        });
    }
}

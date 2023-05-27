import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { getInfoData } from 'src/utils';
import { CreateUserDto, PayloadUserCreatePairTokenDto, UpdateUserDto } from './dto';
import { KeyService } from 'src/key/key.service';
import { CreateKeyDto } from 'src/key/dto/key.dto';
@Injectable() //definite provider
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private readonly keyService: KeyService,
    ) {}

    async findAll(): Promise<User[]> {
        const users = await this.userModel.find();
        return users;
    }

    async getUserById(id: string) {
        if (id === 'all') {
            return await this.findAll();
        } else {
            if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException(`User with id: ${id} not exists`, HttpStatus.NOT_FOUND);
            const res = await this.userModel.findOne({ _id: id }).lean();
            return res;
        }
    }

    getUserByEmail(email: string) {
        return this.userModel.findOne({ email }).lean();
    }

    isValidPassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    async createUser(user: CreateUserDto): Promise<any> {
        // const res = await this.userModel.create(user);
        // return res;
        // const { email } = user;
        const holderEmail = await this.userModel.findOne({ email: user.email }).lean();
        if (holderEmail) {
            throw new HttpException(`User with email ${user.email} already exists`, HttpStatus.BAD_REQUEST);
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        const res = await this.userModel.create({
            ...user,
            password: hashedPassword,
        });
        if (res) {
            //create publicKey and privateKey
            const publicKey = this.keyService.CreateRandomKey();
            const privateKey = this.keyService.CreateRandomKey();

            const payload: CreateKeyDto = {
                user: res._id,
                publicToken: publicKey,
                privateToken: privateKey,
            };
            //save payload to database return publicKey
            const keyStore = await this.keyService.createKeyToken(payload);
            // console.log(`Key store: ${keyStore}`);
            if (!keyStore) {
                throw new HttpException(`publicKey String error`, HttpStatus.CONFLICT);
            }

            const payloadForTokenPair: PayloadUserCreatePairTokenDto = { sub: res._id, username: res.email, role: res.role };
            //create accessToken and refreshToken
            const tokens: object = await this.keyService.createTokenPair(payloadForTokenPair, publicKey, privateKey);
            return {
                user: getInfoData({ fields: ['_id', 'email', 'role'], object: res }),
                tokens: tokens,
            };
        }
    }

    async updateUser(userUpdate: UpdateUserDto) {
        return await this.userModel.updateOne(
            {
                _id: userUpdate._id,
            },
            { ...userUpdate },
        );
    }

    async deleteUser(id: string) {
        const user = await this.getUserById(id);
        // console.log(user);
        if (user) {
            return this.userModel.deleteOne({
                _id: id,
            });
        }
        // return id;
    }
}

import { KeyService } from './../key/key.service';
import { Injectable, HttpException, HttpStatus, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { getInfoData } from 'src/utils';
import { UserService } from 'src/user/user.service';
import { CreateUserDto, LoginUserDto, PayloadUserCreatePairTokenDto } from 'src/user/dto';
import { JwtService } from '@nestjs/jwt';
import { CreateKeyDto } from 'src/key/dto/key.dto';
@Injectable({})
export class AuthService {
    constructor(
        // @InjectModel(User.name)
        // private readonly userModel: mongoose.Model<User>,
        @Inject(UserService)
        private readonly userService: UserService,
        private jwtService: JwtService,
        private readonly keyService: KeyService,
    ) {}

    /**
     * check username and password correct
     * @param username : passport return
     * @param pass : passport return
     * @returns
     */
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.getUserByEmail(username);
        if (user) {
            const isValid = this.userService.isValidPassword(pass, user.password);
            if (isValid) {
                delete user.password;
                delete user.firstName;
                delete user.lastName;
                return user;
            }
        }

        return null;
    }

    async verifyJWT(token: string, keySecret: string): Promise<PayloadUserCreatePairTokenDto> {
        return this.jwtService.verifyAsync(token, {
            secret: keySecret,
        });
    }

    async register(user: CreateUserDto) {
        const res = await this.userService.createUser(user);

        return res;
    }
    /**
     * Create accessToken and refreshToken and save
     * generate tokens
     * @param user include username, role, _id
     * @returns
     */
    async login(user: LoginUserDto): Promise<object> {
        const publicKey = this.keyService.CreateRandomKey();
        const privateKey = this.keyService.CreateRandomKey();

        const payloadForTokenPair = { sub: user._id, username: user.email, role: user.role };
        //create accessToken and refreshToken
        const tokens: { accessToken: string; refreshToken: string } = await this.keyService.createTokenPair(payloadForTokenPair, publicKey, privateKey);

        const payload: CreateKeyDto = {
            user: user._id,
            publicToken: publicKey,
            privateToken: privateKey,
            refreshToken: tokens.refreshToken,
        };
        await this.keyService.createKeyToken(payload);
        return {
            user: user,
            tokens: tokens,
        };
    }

    /**
     *
     * @param keyStore : attached with header, include _id publicKey privateKey
     * @returns
     */
    async logout(keyStore: any) {
        const delKey = await this.keyService.removeKeyTokenById(keyStore._id);
        return delKey;
    }

    /**
     * check this token is used?
     */
    async handleRefreshToken(refreshToken: string, user: any, keyStore: any) {
        const email = user.username;
        const userId = user.sub;

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await this.keyService.deleteKeyById(userId);
            throw new HttpException(`some thing wrong happen`, HttpStatus.FORBIDDEN);
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new UnauthorizedException();
        }

        const foundUser = await this.userService.getUserByEmail(email);
        if (!foundUser) {
            throw new UnauthorizedException();
        }
        //create token pair
        const payloadForTokenPair: PayloadUserCreatePairTokenDto = { sub: userId, username: email, role: user.role };
        const tokens = await this.keyService.createTokenPair(payloadForTokenPair, keyStore.publicKey, keyStore.privateKey);

        //update token pair
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken, //add token old
            },
        });

        return {
            user,
            tokens,
        };
        // //check token is used
        // const foundToken = await this.keyService.findByRefreshTokenUsed(refreshToken);
        // //token is used
        // if (foundToken) {
        //     //decode who is user
        //     const userVerified = await this.verifyJWT(refreshToken, foundToken.privateKey);
        //     console.log(userVerified);

        //     //delete all token in database
        //     await this.keyService.deleteKeyById(userVerified.sub);
        //     throw new HttpException(`some thing wrong happen`, HttpStatus.FORBIDDEN);
        // }

        // //not used

        // const holderToken = await this.keyService.findByRefreshToken(refreshToken);
        // if (!holderToken) {
        //     throw new UnauthorizedException();
        // }
        // // console.log(`herre`);
        // //verify token
        // const userVerified = await this.verifyJWT(refreshToken, holderToken.privateKey);

        // //check userId
        // const foundUser = await this.userService.getUserByEmail(userVerified.username);
    }
}
//'email', 'role',

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { KeyService } from 'src/key/key.service';

export const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id',
};

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private readonly keyService: KeyService) {}

    /**
     * check userId missing?
     * get accessToken
     * verify token
     *
     * @param context
     * @returns
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const userId = this.extractUserIdFromHeader(request);
        if (!userId) {
            throw new UnauthorizedException();
        }

        const keyStore = await this.keyService.findUserById(userId);
        if (!keyStore) {
            throw new HttpException(`Not found keyStore`, HttpStatus.NOT_FOUND);
        }

        const refreshToken = this.extractRefreshTokenFromHeader(request);
        if (refreshToken) {
            try {
                const decodedUser = await this.jwtService.verifyAsync(refreshToken, {
                    secret: keyStore.privateKey,
                });
                // console.log(`herre`, payload.sub);
                if (userId !== decodedUser.sub) {
                    throw new UnauthorizedException();
                }
                // 💡 We're assigning the payload to the request object here
                // so that we can access it in our route handlers
                request['keyStore'] = keyStore;
                request['user'] = decodedUser;
                request['refreshToken'] = refreshToken;
                // return true;
            } catch {
                throw new UnauthorizedException();
            }
        }

        // const token = this.extractTokenFromHeader(request);
        // if (!token) {
        //     throw new UnauthorizedException();
        // }

        // try {
        //     const payload = await this.jwtService.verifyAsync(token, {
        //         secret: keyStore.publicKey,
        //     });
        //     // console.log(`herre`, payload.sub);
        //     if (userId !== payload.sub) {
        //         throw new UnauthorizedException();
        //     }
        //     // 💡 We're assigning the payload to the request object here
        //     // so that we can access it in our route handlers
        //     request['keyStore'] = keyStore;
        // } catch {
        //     throw new UnauthorizedException();
        // }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private extractUserIdFromHeader(request: any): string | undefined {
        const userId = request.headers[HEADER.CLIENT_ID];
        return userId ? userId : undefined;
    }

    private extractRefreshTokenFromHeader(request: any): string | undefined {
        const refreshToken = request.headers[HEADER.REFRESHTOKEN];
        return refreshToken ? refreshToken : undefined;
    }
}

import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthGuard } from './auth.guard';
import { CreateUserDto } from 'src/user/dto';
import { LocalAuthGuard } from './local-auth.guard';

import { JWTAuthGuard } from './jwt-auth.guard';
@Controller()
export class AuthController {
    //auth service is automatically  created when initializing the controller
    constructor(private authService: AuthService) {}

    @Post('register')
    register(
        @Body()
        user: CreateUserDto,
    ) {
        return this.authService.register(user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    handleLogin(@Request() req): Promise<object> {
        return this.authService.login(req.user);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    handleLogout(@Request() req) {
        return this.authService.logout(req.keyStore);
    }

    @UseGuards(AuthGuard)
    @Post('handleRefreshToken')
    handleRefreshToken(@Request() req) {
        // console.log(typeof req.body.refreshToken, 'controller');
        return this.authService.handleRefreshToken(req.refreshToken, req.user, req.keyStore);
    }
}

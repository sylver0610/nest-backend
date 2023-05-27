import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/user/schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JWTAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Patch()
    async updateUser(@Body() userUpdate: UpdateUserDto) {
        /**
         * truyền password vẫn bị update? todoo
         */
        // console.log(userUpdate);
        return this.userService.updateUser(userUpdate);
    }

    @Post()
    async createUser(
        @Body()
        user: CreateUserDto,
    ): Promise<User> {
        return this.userService.createUser(user);
    }

    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }
}

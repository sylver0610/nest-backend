import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/user/dto';
@Controller('auth')
export class AuthController {
  //auth service is automatically  created when initializing the controller
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    user: CreateUserDto,
  ): Promise<User> {
    return this.authService.register(user);
  }

  //   @Post('login')
  //   login() {}
}

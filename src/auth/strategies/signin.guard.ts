// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { UsersService } from '../../users/users.service';
// import { User } from 'src/schemas/user.schema';
// import { AuthService } from '../auth.service';
// import { SigninUserDto } from '../dto/signin-user.dto';

// @Injectable()
// export class SignInGuard implements CanActivate {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly authService: AuthService,
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const req: any = context.switchToHttp().getRequest();
//     const { e_mail, password }: SigninUserDto = req.body;

//     req.user = user;
//     return user.isVerifyMailToken ? true : false;
//   }
// }

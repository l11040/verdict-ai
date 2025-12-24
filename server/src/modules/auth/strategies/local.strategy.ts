import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

type UserWithoutPassword = {
  id: number;
  uid: string;
  email: string;
  nickname: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user: UserWithoutPassword | null =
      await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}

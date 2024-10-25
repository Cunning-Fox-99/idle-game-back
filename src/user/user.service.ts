import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  private readonly secretKey: string;
  private readonly expiresIn: string;
  private readonly telegramSecret: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
    this.expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    this.telegramSecret = this.configService.get<string>('TELEGRAM_FAKE_SECRET');
  }

  async registerUser(telegramId: number, username: string): Promise<{ userId: number; token: string }> {
    if (!this.isValidTelegramId(telegramId)) {
      throw new UnauthorizedException('Invalid Telegram ID');
    }

    let user = await this.userRepository.findByTelegramId(telegramId);
    if (!user) {
      user = await this.userRepository.createUser({ telegramId, username });
    }

    const token = this.generateToken(user.id);
    return { userId: user.id, token };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ id: userId }, this.secretKey, { expiresIn: this.expiresIn });
  }

  private isValidTelegramId(id: number): boolean {
    return id.toString().startsWith('1');
  }

  async getUserProgress(userId: number): Promise<User> {
    return this.userRepository.findById(userId);
  }

  async updateXp(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    const now = new Date();
console.log(user)
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const minutesElapsed = (now.getTime() - user.lastLogin.getTime()) / 60000;
    const earnedXp = Math.floor(minutesElapsed * 5);

    user.xp += earnedXp;

    const nextLevelXp = 100 * Math.pow(1.1, user.level - 1);
    while (user.xp >= nextLevelXp) {
      user.xp -= nextLevelXp;
      user.level += 1;
    }

    user.lastLogin = now;
    return this.userRepository.save(user);
  }
}

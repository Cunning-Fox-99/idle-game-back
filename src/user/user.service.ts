import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  private readonly secretKey = 'your-secret-key';

  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(): Promise<{ userId: number; token: string }> {
    const user = await this.userRepository.createUser();
    const token = this.generateToken(user.id);
    return { userId: user.id, token };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ id: userId }, this.secretKey, { expiresIn: '1h' });
  }

  async updateXp(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    const now = new Date();
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

  async getUserProgress(userId: number): Promise<User> {
    return this.userRepository.findById(userId);
  }
}

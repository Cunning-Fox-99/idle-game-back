import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  private users: User[] = [];

  async findByTelegramId(telegramId: number): Promise<User | undefined> {
    return this.users.find(user => user.telegramId === telegramId);
  }

  async createUser(data: { telegramId: number; username: string }): Promise<User> {
    const user = new User();
    user.id = this.users.length + 1;
    user.telegramId = data.telegramId;
    user.username = data.username;
    user.level = 1;
    user.xp = 0;
    user.lastLogin = new Date();
    this.users.push(user);
    return user;
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.users.find(user => user.id === userId);
  }

  async save(user: User): Promise<User> {
    return user;
  }
}

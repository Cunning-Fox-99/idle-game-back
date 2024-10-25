import { Controller, Post, Body, Get, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() body: { telegramId: number; username: string }) {
    const { telegramId, username } = body;

    if (!telegramId || !username) {
      throw new UnauthorizedException('Telegram ID and username are required');
    }

    return this.userService.registerUser(telegramId, username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/progress')
  async getUserProgress(@Req() req: any) {
    const userId = req.user.id;
    return this.userService.getUserProgress(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/earn')
  async earnXp(@Req() req: any) {
    const userId = req.user.id;
    const user = await this.userService.updateXp(userId);
    return { level: user.level, xp: user.xp };
  }
}

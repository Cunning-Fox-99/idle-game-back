import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser() {
    const { userId, token } = await this.userService.registerUser();
    return { userId, token };
  }

  @Get(':id/progress')
  async getUserProgress(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    const user = await this.userService.getUserProgress(userId);
    return { level: user.level, xp: user.xp };
  }

  @Post(':id/earn')
  async earnXp(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    const user = await this.userService.updateXp(userId);
    return { level: user.level, xp: user.xp };
  }
}

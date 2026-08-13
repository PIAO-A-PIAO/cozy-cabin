import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFocusSessionDto } from './focus-session.dto';

@Injectable()
export class FocusSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async getFocusSessions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.prisma.focusSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createFocusSession(dto: CreateFocusSessionDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.prisma.focusSession.create({
      data: {
        userId,
        plannedDurationMinutes: dto.plannedDurationMinutes,
        actualDurationMinutes:
          dto.actualDurationMinutes ?? dto.plannedDurationMinutes,
      },
    });
  }
}

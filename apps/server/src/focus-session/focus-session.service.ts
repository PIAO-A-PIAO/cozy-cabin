import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFocusSessionDto } from './focus-session.dto';

@Injectable()
export class FocusSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createFocusSession(dto: CreateFocusSessionDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const startTime = new Date(dto.startTime);

    if (Number.isNaN(startTime.getTime())) {
      throw new BadRequestException('Invalid start time');
    }

    const endTime = dto.endTime ? new Date(dto.endTime) : null;

    if (dto.endTime && Number.isNaN(endTime.getTime())) {
      throw new BadRequestException('Invalid end time');
    }

    return this.prisma.focusSession.create({
      data: {
        userId,
        startTime,
        durationMinutes: dto.durationMinutes,
        endTime: endTime ?? undefined,
      },
    });
  }
}

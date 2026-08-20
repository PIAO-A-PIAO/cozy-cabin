import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  getTracks() {
    return this.prisma.track.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FocusSessionController } from './focus-session.controller';
import { FocusSessionService } from './focus-session.service';

@Module({
  controllers: [FocusSessionController],
  providers: [FocusSessionService],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'devFallbackSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class FocusSessionModule {}

import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [LetterController],
  providers: [LetterService],
  imports: [
    PrismaModule,
    JwtModule.register({
          secret: process.env.JWT_SECRET || "devFallbackSecretKey",
          signOptions: { expiresIn: '1d' }
        })
  ]
})
export class LetterModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FocusSessionModule } from './focus-session/focus-session.module';
import { LetterModule } from './letter/letter.module';
import { TrackModule } from './track/track.module';
@Module({
  imports: [AuthModule, LetterModule, FocusSessionModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

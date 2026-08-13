import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FocusSessionModule } from './focus-session/focus-session.module';
import { LetterModule } from './letter/letter.module';
@Module({
  imports: [AuthModule, LetterModule, FocusSessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

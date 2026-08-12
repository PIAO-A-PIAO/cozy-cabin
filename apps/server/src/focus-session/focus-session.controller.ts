import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateFocusSessionDto } from './focus-session.dto';
import { FocusSessionService } from './focus-session.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email?: string;
  };
};

@UseGuards(AuthGuard)
@Controller('focus-sessions')
export class FocusSessionController {
  constructor(private readonly focusSessionService: FocusSessionService) {}

  @Post()
  createFocusSession(
    @Body() dto: CreateFocusSessionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.focusSessionService.createFocusSession(dto, req.user.sub);
  }
}

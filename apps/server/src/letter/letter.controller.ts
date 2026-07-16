import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthGuard } from 'src/auth/auth.guard';
import { LetterService } from './letter.service';
import {
  CreateDraftDto,
  EditDraftDto,
} from './letter.dto';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email?: string;
  };
};



@UseGuards(AuthGuard)
@Controller('letters')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post('draft')
  createDraft(
    @Body() dto: CreateDraftDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.letterService.createDraft(dto, req.user.sub);
  }

  @Patch('draft/:id')
  editDraft(
    @Body() dto: EditDraftDto,
    @Param('id') letterId: string,
    @Req() req: AuthenticatedRequest
  ){
    return this.letterService.editDraft(dto, letterId, req.user.sub)
  }

  @Post('send/:id')
  sendDraft(
    @Param('id') letterId: string,
    @Req() req: AuthenticatedRequest
  ) {
    return this.letterService.sendDraft(letterId, req.user.sub)
  }

  @Get()
  getLetters(
    @Req() req: AuthenticatedRequest,
    @Query('box') box: 'drafts' | 'sent' | 'inbox'
  ) {
    return this.letterService.getLetters(req.user.sub, box)
  }

  @Get(":id")
  getLetter(
    @Req() req: AuthenticatedRequest,
    @Param('id') letterId: string
  ) {
    return this.letterService.getLetter(req.user.sub, letterId)
  }

  @Delete(":id")
  deleteDraft(
    @Req() req: AuthenticatedRequest,
    @Param('id') letterId: string
  ) {
    return this.letterService.deleteDraft(req.user.sub, letterId)
  }
}
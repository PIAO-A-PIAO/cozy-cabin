import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDraftDto, EditDraftDto } from './letter.dto';
import { LetterStatus, Prisma } from '@prisma/client';

const letterListSelect = {
    id: true,
    content: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    sentAt: true,
    sender: {
      select: {
        id: true,
        email: true,
      },
    },
    recipient: {
      select: {
        id: true,
        email: true,
      },
    },
  } satisfies Prisma.LetterSelect;

type LetterListItem = Prisma.LetterGetPayload<{
  select: typeof letterListSelect;
}>;

@Injectable()
export class LetterService {
  constructor(private readonly prisma: PrismaService) {}

  async createDraft(dto: CreateDraftDto, userId: string) {
    const { recipientId } = dto;

    if (recipientId) {
      const recipient = await this.prisma.user.findUnique({
        where: {
          id: recipientId,
        },
      });

      if (!recipient) {
        throw new NotFoundException('Recipient not found');
      }
    }

    return this.prisma.letter.create({
      data: {
        ...dto,
        senderId: userId,
      },
    });
  }

  async editDraft(dto: EditDraftDto, letterId: string, userId: string) {
    const { recipientId } = dto;
    if (recipientId) {
      const recipient = await this.prisma.user.findUnique({
        where: {
          id: recipientId,
        },
      });

      if (!recipient) {
        throw new NotFoundException('Recipient not found');
      }
    }

    const existingDraft = await this.prisma.letter.findUnique({
      where: {
        id: letterId
      }
    })

    if (!existingDraft) {
      throw new NotFoundException('Draft not found')
    }

    if (existingDraft.senderId !== userId) {
      throw new UnauthorizedException("Cannot edit other users' drafts")
    }

    if (existingDraft.status !== LetterStatus.DRAFT) {
      throw new ForbiddenException('Cannot edit sent letters')
    }

    return await this.prisma.letter.update({
      where: {
        id: letterId
      },
      data: {
        ...dto
      }
    })
  }

  async sendDraft(letterId: string, userId: string) {
    const existingDraft = await this.prisma.letter.findUnique({
      where: {
        id: letterId
      }
    })

    if (!existingDraft) {
      throw new NotFoundException("Draft not found")
    }

    if (existingDraft.senderId !== userId) {
      throw new UnauthorizedException("Cannot send other users' drafts")
    }

    if (existingDraft.status !== LetterStatus.DRAFT) {
      throw new ForbiddenException("Cannot send a sent letter")
    }

    if (!existingDraft.recipientId) {
      throw new BadRequestException("Recipient is required")
    }

    const recipient = await this.prisma.user.findUnique({
      where: {
        id: existingDraft.recipientId
      }
    })

    if (!recipient) {
      throw new BadRequestException("Recipient doesn't exist")
    }

    return this.prisma.letter.update({
      where: {id: letterId},
      data: {
        status: LetterStatus.SENT,
        sentAt: new Date(),
      }
    })
  }

  

  async getLetters(
    userId: string,
    box: 'drafts' | 'sent' | 'inbox',
  ) {
    let letters: LetterListItem[];

    switch (box) {
      case 'drafts':
        letters = await this.prisma.letter.findMany({
          where: {
            senderId: userId,
            status: LetterStatus.DRAFT,
          },
          select: letterListSelect,
          orderBy: {
            updatedAt: 'desc',
          },
        });
        break;

      case 'sent':
        letters = await this.prisma.letter.findMany({
          where: {
            senderId: userId,
            status: LetterStatus.SENT,
          },
          select: letterListSelect,
          orderBy: {
            sentAt: 'desc',
          },
        });
        break;

      case 'inbox':
        letters = await this.prisma.letter.findMany({
          where: {
            recipientId: userId,
            status: LetterStatus.SENT,
          },
          select: letterListSelect,
          orderBy: {
            sentAt: 'desc',
          },
        });
        break;
    }

    return letters.map(({ content, ...letter }) => {
      const normalizedContent = content.replace(/\s+/g, ' ').trim();

      return {
        ...letter,
        preview:
          normalizedContent.length > 120
            ? `${normalizedContent.slice(0, 120)}…`
            : normalizedContent,
      };
    });
  }

  async getLetter(userId:string , letterId: string) {
    const existingLetter = await this.prisma.letter.findUnique({
      where:{
        id: letterId
      }
    })
    if (!existingLetter) {
      throw new NotFoundException("Letter doesn't exist")
    }

    if (userId !== existingLetter.recipientId && userId !== existingLetter.senderId) {
      throw new UnauthorizedException("You cannot read this letter")
    }

    return existingLetter
  }

  async deleteDraft(userId: string, letterId: string) {
    const existingLetter = await this.prisma.letter.findUnique({
      where:{
        id: letterId,
        status: LetterStatus.DRAFT
      }
    })
    if (!existingLetter) {
      throw new NotFoundException("Letter doesn't exist")
    }

    if (userId !== existingLetter.senderId) {
      throw new UnauthorizedException("You cannot read this letter")
    }

    return this.prisma.letter.delete({
      where: {
        id: letterId
      }
    })
  }
}
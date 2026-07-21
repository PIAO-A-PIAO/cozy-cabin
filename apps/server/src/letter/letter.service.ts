import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDraftDto, EditDraftDto } from './letter.dto';
import { LetterStatus, Prisma, User } from '@prisma/client';

const letterListSelect = {
    id: true,
    content: true,
    recipientName: true,
    senderName: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    sentAt: true,
    sender: {
      select: {
        id: true,
        // email: true,
        displayName: true,
        streetName: true,
        houseNumber: true,
      },
    },
    recipient: {
      select: {
        id: true,
        // email: true,
        displayName: true,
        streetName: true,
        houseNumber: true,
      },
    },
  } satisfies Prisma.LetterSelect;

type LetterListItem = Prisma.LetterGetPayload<{
  select: typeof letterListSelect;
}>;

@Injectable()
export class LetterService {
  constructor(private readonly prisma: PrismaService) {}

  private async findRecipient(
    dto: Pick<
      CreateDraftDto,
      'recipientName' | 'streetName' | 'houseNumber'
    >,
  ): Promise<User | null> {
    const { recipientName, streetName, houseNumber } = dto;

    const hasRecipientAddress =
      !!recipientName || !!streetName || houseNumber !== undefined;

    if (!hasRecipientAddress) {
      return null;
    }

    if (!recipientName || !streetName || houseNumber === undefined) {
      throw new BadRequestException(
        'Recipient name, street name, and house number are required',
      );
    }

    const recipient = await this.prisma.user.findUnique({
      where: {
        streetName_houseNumber: {
          streetName,
          houseNumber,
        },
      },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    return recipient;
  }

  async createDraft(dto: CreateDraftDto, userId: string) {
    const sender = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!sender) {
      throw new UnauthorizedException('Sender not found');
    }

    const recipient = await this.findRecipient(dto);

    return this.prisma.letter.create({
      data: {
        content: dto.content,
        recipientId: recipient?.id,
        senderId: userId,
        senderName: dto.senderName?.trim() || sender.displayName,
        recipientName: recipient?.displayName ?? '',
      },
    });
  }

  async editDraft(dto: EditDraftDto, letterId: string, userId: string) {
    const recipient = await this.findRecipient(dto);

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
        content: dto.content,
        senderName: dto.senderName?.trim() || undefined,
        ...(recipient
          ? {
              recipientId: recipient.id,
              recipientName: recipient.displayName,
            }
          : {}),
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
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            streetName: true,
            houseNumber: true,
          },
        },
        recipient: {
          select: {
            id: true,
            displayName: true,
            streetName: true,
            houseNumber: true,
          },
        },
      },
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

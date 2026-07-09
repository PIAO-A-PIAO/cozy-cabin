import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async register (dto: RegisterDto): Promise<{id: string, email: string, displayName: string}> {
        const {displayName, email, password} = dto
        const existingUser: User | null = await this.prisma.user.findUnique({
            where: {email}
        })
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        const passwordHash: string = await bcrypt.hash(password, 10)
        const newUser: User | null = await this.prisma.user.create({
            data: {
                email,
                displayName,
                passwordHash
            }
        })
        return {id: newUser.id, email, displayName}
    }

    async login(dto: LoginDto): Promise<{accessToken: string}> {
        const {email, password} = dto
        const existingUser: User | null = await this.prisma.user.findUnique({
            where: {email}
        })
        if (!existingUser) {
            throw new UnauthorizedException()
        }

        const correctPassword = await bcrypt.compare(password, existingUser.passwordHash)
        if (!correctPassword) {
            throw new UnauthorizedException()
        }

        const payload: {sub: string, email: string} = {
            sub: existingUser.id,
            email: existingUser.email
        }

        const accessToken = await this.jwtService.signAsync(payload)
        return {accessToken}
    } 
}

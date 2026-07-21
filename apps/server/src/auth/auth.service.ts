import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AVAILABLE_STREETS } from 'src/config/streets';

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async register (dto: RegisterDto): Promise<{id: string, email: string, displayName: string, streetName: string, houseNumber: number}> {
        const {displayName, email, password} = dto
        const existingUser: User | null = await this.prisma.user.findUnique({
            where: {email}
        })
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        const passwordHash: string = await bcrypt.hash(password, 10)
        const streetName = AVAILABLE_STREETS[Math.floor(Math.random() * AVAILABLE_STREETS.length)]

        const usersOnStreet = await this.prisma.user.findMany({
            where: { streetName },
            select: { houseNumber: true },
            orderBy: { houseNumber: "desc" },
        });

        const usedNumbers = new Set(
            usersOnStreet.map((user) => user.houseNumber),
        );

        let houseNumber = 0;
        for (let number = 1; number <= 999; number++) {
            if (!usedNumbers.has(number)) {
                houseNumber = number
            }
        }

        const newUser: User | null = await this.prisma.user.create({
            data: {
                email,
                displayName,
                passwordHash,
                streetName,
                houseNumber
            }
        })
        return {id: newUser.id, email, displayName, streetName, houseNumber}
    }

    async login(dto: LoginDto) {
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

        const payload: {sub: string, email: string, displayName: string, streetName: string, houseNumber: number} = {
            sub: existingUser.id,
            email,
            displayName: existingUser.displayName,
            streetName: existingUser.streetName,
            houseNumber: existingUser.houseNumber
        }

        const accessToken = await this.jwtService.signAsync(payload)
        return {
            accessToken,
            user: {
                id: existingUser.id,
                email: existingUser.email,
                displayName: existingUser.displayName,
                streetName: existingUser.streetName,
                houseNumber: existingUser.houseNumber
            }
        }
    }
}
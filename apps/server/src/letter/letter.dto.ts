import { IsOptional, IsString } from "class-validator";

export class CreateDraftDto {
    @IsString()
    readonly content!: string;

    @IsString()
    @IsOptional()
    readonly recipientId?: string;
}

export class EditDraftDto {
    @IsString()
    @IsOptional()
    readonly content?: string;

    @IsString()
    @IsOptional()
    readonly recipientId?: string;
}
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateDraftDto {
    @IsString()
    readonly content!: string;

    @IsString()
    @IsOptional()
    readonly senderName?: string;

    @IsString()
    @IsOptional()
    readonly recipientName?: string;

    @IsString()
    @IsOptional()
    readonly streetName?: string;

    @IsInt()
    @Min(1)
    @Max(999)
    @IsOptional()
    readonly houseNumber?: number;
}

export class EditDraftDto {
    @IsString()
    @IsOptional()
    readonly content?: string;

    @IsString()
    @IsOptional()
    readonly senderName?: string;

    @IsString()
    @IsOptional()
    readonly recipientId?: string;

    @IsString()
    @IsOptional()
    readonly recipientName?: string;

    @IsString()
    @IsOptional()
    readonly streetName?: string;

    @IsInt()
    @Min(1)
    @Max(999)
    @IsOptional()
    readonly houseNumber?: number;
}

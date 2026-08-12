import { IsISO8601, IsInt, IsOptional, Min } from 'class-validator';

export class CreateFocusSessionDto {
  @IsISO8601()
  readonly startTime!: string;

  @IsInt()
  @Min(1)
  readonly durationMinutes!: number;

  @IsISO8601()
  @IsOptional()
  readonly endTime?: string;
}

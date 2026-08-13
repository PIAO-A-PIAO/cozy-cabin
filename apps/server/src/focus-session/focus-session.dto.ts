import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateFocusSessionDto {
  @IsInt()
  @Min(1)
  readonly plannedDurationMinutes!: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly actualDurationMinutes?: number;
}

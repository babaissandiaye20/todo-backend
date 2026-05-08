import { Priority } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class ListTodosQueryDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}

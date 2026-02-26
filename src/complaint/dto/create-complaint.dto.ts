import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  organizationId: string;

  @IsString()
  categoryId: string;

  @IsString()
  departmentId: string;

  @IsOptional()
  priority?: Priority;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}

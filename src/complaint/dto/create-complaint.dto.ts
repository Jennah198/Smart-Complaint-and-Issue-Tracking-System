import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}

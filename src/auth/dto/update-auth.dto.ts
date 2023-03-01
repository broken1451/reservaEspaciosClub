import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {

    @ApiProperty()
    @IsString()
    @IsOptional()
    id?: string;
}

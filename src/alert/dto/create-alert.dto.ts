import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsNumber,
  IsEmail
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateAlertDto {
    
    @ApiProperty({ description: 'Token address for the alert' })
    @IsString()
    @IsNotEmpty()
    token_address: string;

    @ApiProperty({ description: 'Target price for the alert' })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()    
    target_price: number;

    @ApiProperty({ description: 'Email address for the alert' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

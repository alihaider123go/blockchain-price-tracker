import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsNumber,
  IsEmail
} from 'class-validator';

export class CreateAlertDto {
    @IsString()
    @IsNotEmpty()
    token_address: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()    
    target_price: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

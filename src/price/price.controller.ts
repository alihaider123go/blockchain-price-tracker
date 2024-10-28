import { Controller,Get,Query } from '@nestjs/common';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {

    constructor(private priceService: PriceService) {}

    @Get('hourly')
    async getHourlyPrices(@Query('token') token: string) {
        return this.priceService.getHourlyPrices(token);
    }


    
    @Get()
    async getTokensPrice() {
        return this.priceService.fetchAndStorePrices();
    }



}

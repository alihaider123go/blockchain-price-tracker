import { Controller,Get,Query } from '@nestjs/common';
import { PriceService } from './price.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('prices')
@Controller('api/prices')
export class PriceController {

    constructor(private priceService: PriceService) {}

    @Get('hourly')
    @ApiOperation({ summary: 'Get hourly price list' })
    async getHourlyPrices(@Query('token') token: string) {
        return this.priceService.getHourlyPrices(token);
    }

}

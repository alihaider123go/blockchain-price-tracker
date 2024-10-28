import { Controller,Get,Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SwapService } from './swap.service';

@ApiTags('swap')
@Controller('api')
export class SwapController {
    constructor(private readonly swapService: SwapService) {}


    @Get('swap-rate')
    @ApiOperation({ summary: 'Get swap rate ETH/BTC' })
    async getSwapRate(@Query('value') value: number) {
        const data =  await this.swapService.getSwapRate(value);
        return data
    }

}

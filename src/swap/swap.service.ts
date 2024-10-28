import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PriceService } from 'src/price/price.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class SwapService {
    constructor(private util: UtilService,private config: ConfigService) {}


    async getSwapRate(value: number) {
        const eth = await this.util.getTokenPrice(this.config.get('WETH_TOKEN_ADDRESS'));
        const btc = await this.util.getTokenPrice(this.config.get('WBTC_TOKEN_ADDRESS'));

        const total_eth_in_usd = value * eth.usdPrice;
        const fee = total_eth_in_usd * 0.0003;
        const feeInEth = fee / eth.usdPrice;
        const net_eth_value_in_usd = total_eth_in_usd - fee;
        const btcAmount = net_eth_value_in_usd / btc.usdPrice;

        return {
            btcAmount,
            totalFee: {
                eth: feeInEth,
                dollar: fee,
            },
        };


        return {eth:eth,btc:btc};

    }

    
}

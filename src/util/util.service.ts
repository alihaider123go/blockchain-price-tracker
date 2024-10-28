import { Injectable, OnModuleInit } from '@nestjs/common';
import Moralis from 'moralis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilService implements OnModuleInit {
    constructor(private readonly config: ConfigService){}
    async onModuleInit() {
        await Moralis.start({
            apiKey: this.config.get('MORALIS_API_KEY'),
        });
    }

    async getTokensPrice() {
        const response = await Moralis.EvmApi.token.getMultipleTokenPrices(
            {
                chain: "0x1"
            },
            {
                tokens: [
                    {
                        tokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" // WETH
                    },
                    {
                        tokenAddress: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0" // Matic
                    }
                ]
            }
        );

        const prices = response.raw.map(token => ({
            tokenAddress: token.tokenAddress,
            usdPriceFormatted: token.usdPriceFormatted,
            usdPrice: token.usdPrice
        }));

        return prices;
    }

}
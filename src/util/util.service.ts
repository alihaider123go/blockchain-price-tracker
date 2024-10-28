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
                        tokenAddress: this.config.get('WETH_TOKEN_ADDRESS') // WETH
                    },
                    {
                        tokenAddress: this.config.get('MATIC_TOKEN_ADDRESS') // Matic
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
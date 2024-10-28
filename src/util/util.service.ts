import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilService {
    private apiKey = '';
    private readonly baseURL = 'https://deep-index.moralis.io/api/v2';
    constructor(private config: ConfigService) {
        this.apiKey = this.config.get('MORALIS_API_KEY'); 
    }


    async getTokenPrice(address: string) {
        try {
            const response = await axios.get(
                `${this.baseURL}/erc20/${address}/price`,
                {
                    headers: {
                        'X-API-Key': this.apiKey,
                    },
                },
            );
            return {address, 'usdPriceFormatted':response.data.usdPriceFormatted,'usdPrice':response.data.usdPrice};

        } catch (error) {
            throw new HttpException(
                'Failed to fetch price from Moralis',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }


    async getTokensPrice() {
        
        const eth = await this.getTokenPrice(this.config.get('WETH_TOKEN_ADDRESS'));
        const matic = await this.getTokenPrice(this.config.get('MATIC_TOKEN_ADDRESS'));

        const prices = [];
        prices.push({
            tokenAddress: eth.address,
            usdPriceFormatted: eth.usdPriceFormatted,
            usdPrice: eth.usdPrice
        });

        prices.push({
            tokenAddress: matic.address,
            usdPriceFormatted: matic.usdPriceFormatted,
            usdPrice: matic.usdPrice
        });

        return prices;
    }




}

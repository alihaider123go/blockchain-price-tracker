import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UtilService } from 'src/util/util.service';
import { subHours } from 'date-fns';
import { groupBy, minBy, maxBy } from 'lodash';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
@Injectable()
export class PriceService {

    constructor(private db: DatabaseService,private util: UtilService,private config: ConfigService,private emailService: EmailService) {}

    async getHourlyPrices(token: string) {
        const now = new Date();
        const start = subHours(now, 24);

        const prices = await this.db.price.findMany({
        where: {
            token_address:token,
            timestamp: {
            gte: start,
            },
        },
        orderBy: {
            timestamp: 'asc',
        },
        });

        const groupedPrices = groupBy(prices, (price) => {
            const date = new Date(price.timestamp);
            return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}`;
        });

        const formatedDataSet = Object.entries(groupedPrices).map(([hourlyTimestamp, values]) => {
            const maxValueObj = maxBy(values, 'value');
            const minValueObj = minBy(values, 'value');

            return {
                date_time:  `${new Date(`${hourlyTimestamp}:00Z`).toISOString()} UTC`,
                max:{
                    value:maxValueObj.value,
                    timestamp:maxValueObj.timestamp,
                },
                min:{
                    value:minValueObj.value,
                    timestamp:minValueObj.timestamp,
                }
            };
        });

        const result = {
            token:token,
            prices:formatedDataSet
        }
        return result;

    }


    @Cron(CronExpression.EVERY_5_MINUTES)
    async fetchAndStorePrices() {
        const prices =  await this.util.getTokensPrice();
        for (const { tokenAddress, usdPrice } of prices) {
            await this.db.price.create({
                data: { token_address:tokenAddress, value:usdPrice },
            });
        }
        console.log("Prices saved!");
        // return {status:201,msg:"Prices saved!"}
    }
    

    async getCurrentPrice(token_address: string) {
        const latestPrice = await this.db.price.findFirst({
        where: { token_address },
        orderBy: { timestamp: 'desc' },
        });
        return latestPrice ? latestPrice.value : null;
    }

    async getPriceOneHourAgo(token_address: string) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); 
        const priceOneHourAgo = await this.db.price.findFirst({
        where: {
            token_address,
            timestamp: {
            gte: oneHourAgo,
            },
        },
        orderBy: {
            timestamp: 'desc',
        },
        });
        return priceOneHourAgo ? priceOneHourAgo.value : null;
    }


    @Cron(CronExpression.EVERY_10_SECONDS)
    async monitorPriceChanges() {
        const tokens = [this.config.get("WETH_TOKEN_ADDRESS"),this.config.get("MATIC_TOKEN_ADDRESS")];
        for (const token of tokens) {
            const currentPrice = await this.getCurrentPrice(token);
            const oneHourAgoPrice = await this.getPriceOneHourAgo(token);
            
            if (oneHourAgoPrice) {
                const percentageIncrease = ((currentPrice - oneHourAgoPrice) / oneHourAgoPrice) * 100;
                if (percentageIncrease > 3) {
                    await this.emailService.sendPriceChangeAlert(
                        'hyperhire_assignment@hyperhire.in',
                        token,
                        currentPrice,
                        oneHourAgoPrice,
                    );
                }
            }
        }
    }



    // async fetchTokenPrice(token:string) {
    //     const price =  await this.util.getTokenPrice(token);
    //     return price;
    // }
    


}


import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UtilService } from 'src/util/util.service';
import { subHours,format } from 'date-fns';
import { groupBy, minBy, maxBy } from 'lodash';

@Injectable()
export class PriceService {

    constructor(private db: DatabaseService,private util: UtilService) {}

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

    async fetchAndStorePrices() {
        const prices =  await this.util.getTokensPrice();
        for (const { tokenAddress, usdPrice } of prices) {
        await this.db.price.create({
            data: { token_address:tokenAddress, value:usdPrice },
        });
        }
        return {status:201,msg:"Prices saved!"}
    }
    


}

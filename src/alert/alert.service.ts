import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriceService } from 'src/price/price.service';

@Injectable()
export class AlertService {

    constructor(private db: DatabaseService, private emailService: EmailService, private priceService: PriceService){}

    async setAlert(alertDto: CreateAlertDto) {
        await this.db.alert.create({
            data: {
                token_address: alertDto.token_address,
                target_price: alertDto.target_price,
                email: alertDto.email,
            },
        });
        
        return {status:201,msg:"Alert created!"}
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async checkAlerts() {
        const alerts = await this.db.alert.findMany({ where: { isTriggered: false } });
        for (const alert of alerts) {
            const price =await this.priceService.getCurrentPrice(alert.token_address);
            if (price && price >= alert.target_price) {
                await this.sendAlertEmail(alert.email, alert.token_address, alert.target_price);
                await this.db.alert.update({
                    where: { id: alert.id },
                    data: { isTriggered: true },
                });
            }
        }
    }

    async sendAlertEmail(email:string, token:string, target_price:number) {
        this.emailService.sendPriceAlert(email,token,target_price);
    }




}

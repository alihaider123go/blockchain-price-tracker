import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    constructor(private config: ConfigService) {}

    mailTransport(){
        const transport = nodemailer.createTransport({
            host: this.config.get("MAIL_HOST"),
            port: this.config.get("MAIL_PORT"),
            secure:false,
            auth: {
                user: this.config.get("MAIL_USER"),
                pass: this.config.get("MAIL_PASS"),
            },
        });
        return transport;
    }

    async sendPriceChangeAlert(email: string, token: string, currentPrice: number, previousPrice: number) {
        const mailOptions = {
            from: {name:this.config.get("APP_NAME"),address:this.config.get("MAIL_USER")},
            to: email,
            subject: `Price Change Alert`,
            text: `The price of ${token} has increased by more than 3%!\nCurrent Price: $${currentPrice}\nPrevious Price: $${previousPrice}`,
        };

        const transport = this.mailTransport();
        try {
            const result = await transport.sendMail(mailOptions);    
        }catch(error){
            console.log(error);
        }
    }


    async sendPriceAlert(email: string, token: string, target_price:number) {
        const mailOptions = {
            from: {name:this.config.get("APP_NAME"),address:this.config.get("MAIL_USER")},
            to: email,
            subject: `Price Alert`,
            text: `Your alert for the token is triggered. Price is ${target_price}. Token is ${token}`,
        };
        const transport = this.mailTransport();
        try {
            const result = await transport.sendMail(mailOptions);    
        }catch(error){
            console.log(error);
        }
    }
}
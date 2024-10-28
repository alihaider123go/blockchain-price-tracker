import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceController } from './price/price.controller';
import { PriceService } from './price/price.service';
import { PriceModule } from './price/price.module';
import { DatabaseModule } from './database/database.module';
import { UtilService } from './util/util.service';
import { UtilModule } from './util/util.module';
import { AlertController } from './alert/alert.controller';
import { AlertService } from './alert/alert.service';
import { AlertModule } from './alert/alert.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SwapService } from './swap/swap.service';
import { SwapController } from './swap/swap.controller';
import { SwapModule } from './swap/swap.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PriceModule, 
        DatabaseModule,UtilModule, AlertModule, EmailModule, SwapModule
    ],
    controllers: [AppController, PriceController, AlertController, SwapController],
    providers: [AppService, PriceService, UtilService, AlertService, EmailService, SwapService],
})
export class AppModule {}

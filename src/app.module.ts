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

@Module({
    imports: [
        ConfigModule.forRoot({
        isGlobal: true,
        }),
        PriceModule, 
        DatabaseModule, UtilModule, AlertModule
    ],
    controllers: [AppController, PriceController, AlertController],
    providers: [AppService, PriceService, UtilService, AlertService],
})
export class AppModule {}

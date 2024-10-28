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

@Module({
    imports: [
        ConfigModule.forRoot({
        isGlobal: true,
        }),
        PriceModule, 
        DatabaseModule, UtilModule
    ],
    controllers: [AppController, PriceController],
    providers: [AppService, PriceService, UtilService],
})
export class AppModule {}

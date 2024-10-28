import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AlertService {

    constructor(private db: DatabaseService) {}

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

}

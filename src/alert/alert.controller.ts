import { Body, Controller, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto';

@Controller('alerts')
export class AlertController {
    constructor(private alertService: AlertService) {}

    @Post('create')
    async setAlert(@Body() alertDto: CreateAlertDto) {
        return this.alertService.setAlert(alertDto);
    }
}

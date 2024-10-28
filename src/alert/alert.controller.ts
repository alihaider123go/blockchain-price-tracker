import { Body, Controller, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('alerts')
@Controller('api/alerts')
export class AlertController {
    constructor(private alertService: AlertService) {}

    @Post('create')
    @ApiOperation({ summary: 'Create a new alert' })
    async setAlert(@Body() alertDto: CreateAlertDto) {
        return this.alertService.setAlert(alertDto);
    }
}

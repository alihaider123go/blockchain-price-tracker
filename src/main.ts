import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
        whitelist: true,
        }),
    );

    const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker')
    .setVersion('1.0')
    .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
     SwaggerModule.setup('api', app, documentFactory, {
        explorer: false,
    });

    await app.listen(process.env.PORT ?? 3300);
}
bootstrap();

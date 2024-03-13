/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/')
  app.enableCors()
  const PORT = process.env.PORT || 8083
  await app.listen(PORT, ()=>{
    console.log(`server running on port: ${PORT}`);
  });
}
bootstrap();

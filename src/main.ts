import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common/pipes';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const validationPipe = app.select(AppModule).get(ValidationPipe);
  //add middleware here
  // This will cause class-validator to use the nestJS module resolution,
  // the fallback option is to spare our selfs from importing all the class-validator modules to nestJS
  // useContainer(app.select(AppModule), { fallback: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3055);
}
bootstrap();

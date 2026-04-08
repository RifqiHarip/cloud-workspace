import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000
  const dbUrl = process.env.DATABASE_URL ?? "mysql://root@localhost:3306/cloud_workspace"
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Database connected on: ${dbUrl}`);

}
bootstrap();

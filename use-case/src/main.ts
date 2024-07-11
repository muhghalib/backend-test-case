import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";

import { AppModule } from "./app.module";

import helmet from "helmet";
import { HttpExceptionFilter } from "./common/exception/http-exception/http-exception.filter";

import * as basicAuth from "express-basic-auth";

export const setSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  const basicAuthUser = configService.get("BASIC_AUTH_USER");
  const basicAuthPass = configService.get("BASIC_AUTH_PASS");
  const nodeEnv = configService.get("NODE_ENV");

  console.log(nodeEnv);

  if (nodeEnv == "production") {
    app.use(
      basicAuth({
        challenge: true,
        users: {
          [basicAuthUser]: basicAuthPass,
        },
        unauthorizedResponse: (req) => {
          if (req.auth) {
            return "Unauthorized: Access is denied due to invalid credentials.";
          } else {
            return "No basic auth credentials provided";
          }
        },
      }),
    );
  }

  const config = new DocumentBuilder()
    .addBasicAuth()
    .setTitle(configService.get("app.title"))
    .setDescription(configService.get("app.description"))
    .setVersion(configService.get("app.version"))
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("/api/v1/docs", app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get("app.port");

  app.enableCors();
  app.use(helmet());

  app.setGlobalPrefix("/api/v1");
  setSwagger(app);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, () => console.info(`Server listening to port:`, port));
}

bootstrap();

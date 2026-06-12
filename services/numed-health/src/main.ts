import { bootstrapHttpApp } from "@shared/infra/http/bootstrap-http-app";
import { AppModule } from "./app.module";

void bootstrapHttpApp(AppModule, {
  title: "Numed Health API",
  description: "Microsservico de medicamentos, consumo e cuidadores.",
  port: process.env.PORT,
});

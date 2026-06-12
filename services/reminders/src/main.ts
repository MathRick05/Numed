import { bootstrapHttpApp } from "@shared/infra/http/bootstrap-http-app";
import { AppModule } from "./app.module";

void bootstrapHttpApp(AppModule, {
  title: "Reminders API",
  description: "Microsservico de lembretes e agendamentos.",
  port: process.env.PORT,
});

import { Application } from 'express';

export default abstract class RoutesConfig {
  app: Application;
  name: string;

  constructor(app: Application, routeName: string) {
    this.app = app;
    this.name = routeName;
    this.configRoutes();
  }

  abstract configRoutes(): Application;
}

import express, { Router } from 'express';

export default abstract class RoutesConfig {
  router: Router;
  name: string;

  constructor(routeName: string) {
    this.router = express.Router();
    this.name = routeName;
    this.configRouter();
  }

  abstract configRouter(): Router;
}

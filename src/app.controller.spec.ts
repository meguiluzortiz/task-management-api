import { Test, TestingModule } from '@nestjs/testing';
import { AppController, Redirect } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const response: Redirect = appController.redirectSwagger();
      expect(response.url).toBe('/api-docs');
    });
  });
});

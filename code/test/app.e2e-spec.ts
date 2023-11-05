import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { CredentialDto } from '../src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3001);
    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: CredentialDto = {
      username: 'john',
      password: 'doe',
    };

    describe('SignIn', () => {
      it('should throw if username is null', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if username is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            username: '',
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is null', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            username: dto.username,
          })
          .expectStatus(400);
      });
      it('should throw if username is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            username: dto.username,
            password: '',
          })
          .expectStatus(400);
      });
    });
  });
});

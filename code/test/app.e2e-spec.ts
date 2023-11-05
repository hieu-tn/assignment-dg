import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { CredentialDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3001);

    let prisma = app.get(PrismaService);
    prisma.cleanDb();

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

    describe('SignUp', () => {
      it('should throw if username is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: dto.username,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

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
      it('should throw if no payload provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should sign in', async () => {
        return await pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores((request, response) => {
            return {cookie: response.headers['set-cookie'][0]};
          });
      });
    });
  });

  describe('User', () => {
    describe('Profile', () => {
      it('should return current user profile', () => {
        return pactum
          .spec()
          .get('/user/profile')
          .withCookies('$S{cookie}')
          .expectStatus(200);
      });
    });
  });

  describe('Product', () => {
    describe('Get empty products', () => {
      it('should get products', () => {
        return pactum
          .spec()
          .get('/product')
          .withCookies('$S{cookie}')
          .withQueryParams({
            page: 1,
            itemsPerPage: -1,
          })
          .expectStatus(200)
          .expectJson({
            totalRecords: 0,
            results: [],
          });
      });
    });

    describe('Create product', () => {
      it('should throw if missing required fields', () => {
        return pactum
          .spec()
          .post('/product')
          .withCookies('$S{cookie}')
          .withBody({})
          .expectStatus(400);
      });
      it('should create product', () => {
        return pactum
          .spec()
          .post('/product')
          .withCookies('$S{cookie}')
          .withBody({
            name: 'First Product',
            upc: 'First upc',
            description: 'First description',
          })
          .expectStatus(201)
          .stores('firstProductId', 'id');
      });
      it('should create product even duplicated name', () => {
        return pactum
          .spec()
          .post('/product')
          .withCookies('$S{cookie}')
          .withBody({
            name: 'Second Product',
            upc: 'Second upc',
            description: 'Second description',
          })
          .expectStatus(201)
          .stores('secondProductId', 'id');
      });
      it('should throw if data contains non-ascii character(s)', () => {
        return pactum
          .spec()
          .post('/product')
          .withCookies('$S{cookie}')
          .withBody({
            name: "Third Product\xe2",
            upc: "Third upc\xe2",
            description: "Third description\xe2",
          })
          .expectStatus(400);
      });
      it('should remove postgres null character', () => {
        return pactum
          .spec()
          .post('/product')
          .withCookies('$S{cookie}')
          .withBody({
            name: "Third Product\x00",
            upc: "Third upc\x00",
            description: "Third description\x00",
          })
          .expectStatus(201)
          .expectJsonLike({
            name: "Third Product",
            upc: "Third upc",
            description: "Third description",
          });
      });
    });

    describe('Get products', () => {
      it('should throw if missing required parameters', () => {
        return pactum
          .spec()
          .get('/product')
          .withCookies('$S{cookie}')
          .expectStatus(400);
      });
      it('should return no record if invalid parameters', () => {
        return pactum
          .spec()
          .get('/product')
          .withCookies('$S{cookie}')
          .withQueryParams({
            page: -1,
            itemsPerPage: 1,
          })
          .expectStatus(200)
          .expectJson({
            totalRecords: 0,
            results: [],
          });
      });
      it('should return empty if invalid parameters', () => {
        return pactum
          .spec()
          .get('/product')
          .withCookies('$S{cookie}')
          .withQueryParams({
            page: 1,
            itemsPerPage: -2,
          })
          .expectStatus(200)
          .expectJson({
            totalRecords: 0,
            results: [],
          });
      });
      it('should get all products', () => {
        return pactum
          .spec()
          .get('/product')
          .withCookies('$S{cookie}')
          .withQueryParams({
            page: 1,
            itemsPerPage: -1,
          })
          .expectStatus(200)
          .expectJsonLike({
            totalRecords: 3,
          });
      });
      it('should get products', () => {
        return pactum
          .spec()
          .get('/product')
          .withCookies('$S{cookie}')
          .withQueryParams({
            page: 1,
            itemsPerPage: 2,
          })
          .expectStatus(200)
          .expectJsonLike({
            totalRecords: 3,
          })
          .expectJsonLength('results', 2);
      });
    });

    describe('Get product by id', () => {
      it('should throw if product not exists/belongs to user', () => {
        return pactum
          .spec()
          .get('/product/{id}')
          .withPathParams('id', 9999)
          .withCookies('$S{cookie}')
          .expectStatus(403);
      });
      it('should get product by id', () => {
        return pactum
          .spec()
          .get('/product/{id}')
          .withPathParams('id', '$S{firstProductId}')
          .withCookies('$S{cookie}')
          .expectStatus(200)
          .expectBodyContains('$S{firstProductId}');
      });
    });

    describe('Update product by id', () => {
      it('should throw if data contains non-ascii character(s)', () => {
        return pactum
          .spec()
          .patch('/product/{id}')
          .withPathParams('id', '$S{firstProductId}')
          .withCookies('$S{cookie}')
          .withBody({
            name: 'Product\xe2',
            upc: 'upc\xe2',
            description: 'description\xe2',
          })
          .expectStatus(400);
      });
      it('should edit product', () => {
        return pactum
          .spec()
          .patch('/product/{id}')
          .withPathParams('id', '$S{firstProductId}')
          .withCookies('$S{cookie}')
          .withBody({
            name: 'Another First Product',
            upc: 'Another First upc',
            description: 'Another First description',
          })
          .expectStatus(200)
          .expectBodyContains('Another First Product')
          .expectBodyContains('Another First upc')
          .expectBodyContains('Another First description');
      });
    });

    describe('Remove product by id', () => {
      it('should throw if product not exists/belongs to user', () => {
        return pactum
          .spec()
          .delete('/product/{id}')
          .withPathParams('id', 9999)
          .withCookies('$S{cookie}')
          .expectStatus(403);
      });
      it('should remove product', () => {
        return pactum
          .spec()
          .delete('/product/{id}')
          .withPathParams('id', '$S{firstProductId}')
          .withCookies('$S{cookie}')
          .expectStatus(204);
      });
      it('should get products', () => {
        return pactum
          .spec()
          .get('/product')
          .withCookies('$S{cookie}')
          .withQueryParams({
            page: 1,
            itemsPerPage: -1,
          })
          .expectStatus(200)
          .expectJsonLike({
            totalRecords: 2,
          })
          .expectJsonLength('results', 2);
      });
    });
  });
});

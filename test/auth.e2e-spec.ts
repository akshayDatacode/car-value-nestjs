import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: "ass34asas@ss.com", password: "sdssdsdsd" })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body
        expect(id).toBeDefined()
        expect(email).toEqual("ass34asas@ss.com")
      })
  });

  it('signup as a new user then get the currently loggedin user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: "dsdsds@gmail.com", password: 'asff' })
      .expect(201)

    const cookie = res.get('Set-Cookie')

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)

    expect(body.email).toEqual("dsdsds@gmail.com")
  })

  afterEach(async () => {
    await app.close();
  });
});

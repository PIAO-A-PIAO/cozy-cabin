import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Letters API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userAToken: string;
  let userBToken: string;
  let userCToken: string;

  let userAId: string;
  let userBId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get(PrismaService);

    await cleanDatabase();

    const userA = await registerUser(
      'user-a@example.com',
      'Password123!',
      'Alice',
    );

    const userB = await registerUser(
      'user-b@example.com',
      'Password123!',
      'Bob',
    );

    const userC = await registerUser(
      'user-c@example.com',
      'Password123!',
      'Charlie',
    );

    userAToken = userA.token;
    userBToken = userB.token;
    userCToken = userC.token;
  
    userAId = userA.user.id;
    userBId = userB.user.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await app.close();
  });

  async function cleanDatabase() {
    await prisma.letter.deleteMany();
    await prisma.user.deleteMany();
  }

  async function registerUser(
    email: string,
    password: string,
    displayName: string,
  ) {
    // 1. Register the user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password,
        displayName,
      })
      .expect(201);

    // 2. Log in the user to obtain the access token and user info
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);

    // 3. Map the login response ('accessToken' -> 'token') to match what the test expects
    return {
      token: loginResponse.body.accessToken,
      user: loginResponse.body.user,
    };
  }

  function createDraft(
    token: string,
    data: {
      content: string;
      recipientId?: string;
    },
  ) {
    return request(app.getHttpServer())
      .post('/letters/draft')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
  }

  function editDraft(
    token: string,
    letterId: string,
    data: {
      content?: string;
      recipientId?: string;
    },
  ) {
    return request(app.getHttpServer())
      .patch(`/letters/draft/${letterId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
  }

  function sendDraft(token: string, letterId: string) {
    return request(app.getHttpServer())
      .post(`/letters/send/${letterId}`)
      .set('Authorization', `Bearer ${token}`);
  }

  function getLetter(token: string, letterId: string) {
    return request(app.getHttpServer())
      .get(`/letters/${letterId}`)
      .set('Authorization', `Bearer ${token}`);
  }

  describe('POST /letters/draft', () => {
    it('allows a user to create a draft', async () => {
      const response = await createDraft(userAToken, {
        content: 'Hello from user A',
        recipientId: userBId,
      }).expect(201);

      expect(response.body).toMatchObject({
        content: 'Hello from user A',
        senderId: userAId,
        recipientId: userBId,
        status: 'DRAFT',
      });

      expect(response.body.id).toBeDefined();
    });
  });

  describe('PATCH /letters/draft/:id', () => {
    let draftId: string;

    beforeEach(async () => {
      const response = await createDraft(userAToken, {
        content: 'Draft content',
        recipientId: userBId,
      }).expect(201);
      draftId = response.body.id;
    });

    it('allows the owner to edit their draft', async () => {
      const response = await editDraft(userAToken, draftId, {
        content: 'Updated draft content',
      }).expect(200);

      expect(response.body).toMatchObject({
        id: draftId,
        content: 'Updated draft content',
        senderId: userAId,
        recipientId: userBId,
        status: 'DRAFT',
      });
    });

    it('does not allow editing a draft with a non-existent recipient', async () => {
      await editDraft(userAToken, draftId, {
        recipientId: 'non-existent-user-id',
      }).expect(404);
    });

    it('does not allow a different user to edit the draft', async () => {
      await editDraft(userBToken, draftId, {
        content: 'Trying to steal draft',
      }).expect(401);
    });

    it('does not allow editing a draft after it is sent', async () => {
      // First, send the draft
      await sendDraft(userAToken, draftId).expect(201);

      // Try editing it
      await editDraft(userAToken, draftId, {
        content: 'Trying to edit sent letter',
      }).expect(403);
    });
  });

  describe('POST /letters/send/:id', () => {
    let draftId: string;
    let draftWithNoRecipientId: string;

    beforeEach(async () => {
      const draftRes = await createDraft(userAToken, {
        content: 'Draft for B',
        recipientId: userBId,
      }).expect(201);
      draftId = draftRes.body.id;

      const draftNoRecipRes = await createDraft(userAToken, {
        content: 'Draft without recipient',
      }).expect(201);
      draftWithNoRecipientId = draftNoRecipRes.body.id;
    });

    it('does not allow a different user to send the draft', async () => {
      await sendDraft(userBToken, draftId).expect(401);
    });

    it('does not allow sending a draft without a recipient', async () => {
      await sendDraft(userAToken, draftWithNoRecipientId).expect(400);
    });

    it('allows the owner to send their draft', async () => {
      const response = await sendDraft(userAToken, draftId).expect(201);

      expect(response.body).toMatchObject({
        id: draftId,
        status: 'SENT',
      });
      expect(response.body.sentAt).toBeDefined();
    });

    it('does not allow sending the draft again once sent', async () => {
      await sendDraft(userAToken, draftId).expect(201);
      await sendDraft(userAToken, draftId).expect(403);
    });
  });

  describe('GET /letters/:id', () => {
    let draftId: string;
    let sentLetterId: string;

    beforeEach(async () => {
      const draftRes = await createDraft(userAToken, {
        content: 'Draft content for B',
        recipientId: userBId,
      }).expect(201);
      draftId = draftRes.body.id;

      const sentRes = await createDraft(userAToken, {
        content: 'Sent content for B',
        recipientId: userBId,
      }).expect(201);
      sentLetterId = sentRes.body.id;
      await sendDraft(userAToken, sentLetterId).expect(201);
    });

    it('allows the sender to read the draft', async () => {
      const response = await getLetter(userAToken, draftId).expect(200);
      expect(response.body.content).toBe('Draft content for B');
    });

    it('allows the sender to read the sent letter', async () => {
      const response = await getLetter(userAToken, sentLetterId).expect(200);
      expect(response.body.content).toBe('Sent content for B');
    });

    it('allows the recipient to read the sent letter', async () => {
      const response = await getLetter(userBToken, sentLetterId).expect(200);
      expect(response.body.content).toBe('Sent content for B');
    });

    it('does not allow a third-party user to read the draft', async () => {
      // User C tries to read A's draft
      await getLetter(userCToken, draftId).expect(401);
    });

    it('does not allow a third-party user to read the sent letter', async () => {
      // User C tries to read A's letter to B
      await getLetter(userCToken, sentLetterId).expect(401);
    });
  });
});
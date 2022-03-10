/* eslint-disable no-undef */
/* eslint-disable jest/no-disabled-tests */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

const request = require('supertest');

const { app, server } = require('../../src/server');
const {
  newOperationData,
  jwtAuth,
  fileFront,
  fileBack,
  fileSelfie,
} = require('./vuUserInfoTest');

describe('finish operation to be OK', () => {
  afterAll(async () => {
    server.close();
  });

  it('responds final operation OK', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post('/vuSecurity/createVerification')
      .set('Authorization', jwtAuth)
      .send(newOperationData)
      .expect(200);

    // GUARDO PARAMETROS NECESARIOS PARA LAS SIGUIENTES OPERACIONES.
    const params = {
      operationId: JSON.stringify(res.body.data.operationId),
      userName: res.body.data.userName,
      side: 'front',
      file: fileFront,
    };

    // AGREGO EL FRENDE LA IDENTIFICACION
    await request(app)
      .post('/vuSecurity/addDocumentImage')
      .set('Authorization', jwtAuth)
      .send(params)
      .expect(200);

    // AGREGO EL BACK DE LA IDENTIFICACION
    params.side = 'back';
    params.file = fileBack;
    await request(app)
      .post('/vuSecurity/addDocumentImage')
      .set('Authorization', jwtAuth)
      .send(params)
      .expect(200);

    // AGREGO LA SELDIE
    params.side = 'selfie';
    params.file = fileSelfie;
    await request(app)
      .post('/vuSecurity/addDocumentImage')
      .set('Authorization', jwtAuth)
      .send(params)
      .expect(200);

    // FINALIZAR OPERACION
    await request(app)
      .post('/vuSecurity/finishOperation')
      .set('Authorization', jwtAuth)
      .send(params)
      .expect(200);

    // CONSULTO ESTADO DE LA OPERACION
    await request(app)
      .post('/vuSecurity/getStatus')
      .set('Authorization', jwtAuth)
      .send(params)
      .expect(200)
      .then((response) => {
        expect(response.body.data.status).toBe('Successful');
      });
  });
});

describe('cancel operation to be OK', () => {
  it('responds cancel operation OK', async () => {
    expect.assertions(1);
    const res = await request(app)
      .post('/vuSecurity/createVerification')
      .set('Authorization', jwtAuth)
      .send(newOperationData)
      .expect(200);

    // GUARDO PARAMETROS NECESARIOS PARA LAS SIGUIENTES OPERACIONES.
    const params = {
      operationId: JSON.stringify(res.body.data.operationId),
      userName: res.body.data.userName,
    };

    // FINALIZAR OPERACION
    await request(app)
      .post('/vuSecurity/cancelVerification')
      .set('Authorization', jwtAuth)
      .send(params)
      .expect(200);

    // CONSULTAR ESTADO DE LA OPERACION
    await request(app)
      .post('/vuSecurity/getStatus')
      .set('Authorization', jwtAuth)
      .send(params)
      .expect(200)
      .then((response) => {
        expect(response.body.data.status).toBe('Cancelled');
      });
  });
});

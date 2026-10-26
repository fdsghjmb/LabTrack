import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { createApp } from './app.js';

let server;
let base;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'labtrack-'));

before(async () => {
  const app = createApp({ dbFile: path.join(dir, 'db.json'), secret: 'test-secret' });
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}/api`;
});

after(() => {
  server.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

async function call(method, url, { body, token } = {}) {
  const res = await fetch(base + url, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json();
  return { status: res.status, data };
}

const register = (email, name = 'Іван') =>
  call('POST', '/auth/register', { body: { name, email, password: 'secret123' } });

const lab = {
  subject: 'Веб',
  number: 1,
  title: 'Тема',
  deadline: '2030-01-15',
  status: 'todo',
};

describe('авторизація', () => {
  it('реєструє користувача й повертає токен', async () => {
    const { status, data } = await register('a@uzhnu.edu.ua');
    assert.equal(status, 201);
    assert.ok(data.token);
    assert.equal(data.user.email, 'a@uzhnu.edu.ua');
    assert.equal(data.user.passwordHash, undefined);
  });

  it('не дозволяє зареєструвати ту саму пошту двічі', async () => {
    await register('dup@uzhnu.edu.ua');
    const { status } = await register('dup@uzhnu.edu.ua');
    assert.equal(status, 409);
  });

  it('відхиляє короткий пароль', async () => {
    const { status } = await call('POST', '/auth/register', {
      body: { name: 'Іван', email: 'short@uzhnu.edu.ua', password: '123' },
    });
    assert.equal(status, 400);
  });

  it('пускає з правильним паролем і блокує з неправильним', async () => {
    await register('login@uzhnu.edu.ua');
    const ok = await call('POST', '/auth/login', {
      body: { email: 'login@uzhnu.edu.ua', password: 'secret123' },
    });
    assert.equal(ok.status, 200);
    const bad = await call('POST', '/auth/login', {
      body: { email: 'login@uzhnu.edu.ua', password: 'wrong-pass' },
    });
    assert.equal(bad.status, 401);
  });

  it('повертає поточного користувача за токеном', async () => {
    const { data } = await register('me@uzhnu.edu.ua');
    const me = await call('GET', '/auth/me', { token: data.token });
    assert.equal(me.status, 200);
    assert.equal(me.data.email, 'me@uzhnu.edu.ua');
  });
});

describe('лабораторні', () => {
  it('закриті без токена', async () => {
    assert.equal((await call('GET', '/labs')).status, 401);
    assert.equal((await call('GET', '/labs', { token: 'fake' })).status, 401);
  });

  it('створює, змінює й видаляє лабораторну', async () => {
    const { data } = await register('crud@uzhnu.edu.ua');
    const token = data.token;

    const created = await call('POST', '/labs', { token, body: lab });
    assert.equal(created.status, 201);
    assert.equal(created.data.userId, undefined);

    const list = await call('GET', '/labs', { token });
    assert.equal(list.data.length, 1);

    const patched = await call('PATCH', `/labs/${created.data.id}`, {
      token,
      body: { status: 'defended' },
    });
    assert.equal(patched.data.status, 'defended');
    assert.equal(patched.data.subject, 'Веб');

    const removed = await call('DELETE', `/labs/${created.data.id}`, { token });
    assert.equal(removed.status, 204);
    assert.equal((await call('GET', '/labs', { token })).data.length, 0);
  });

  it('перевіряє дані при створенні', async () => {
    const { data } = await register('valid@uzhnu.edu.ua');
    const token = data.token;
    for (const bad of [
      { ...lab, subject: '' },
      { ...lab, number: 0 },
      { ...lab, deadline: '2030-02-31' },
      { ...lab, status: 'unknown' },
    ]) {
      assert.equal((await call('POST', '/labs', { token, body: bad })).status, 400);
    }
  });

  it('не показує й не змінює чужі лабораторні', async () => {
    const owner = (await register('owner@uzhnu.edu.ua')).data.token;
    const stranger = (await register('stranger@uzhnu.edu.ua')).data.token;
    const created = await call('POST', '/labs', { token: owner, body: lab });

    assert.equal((await call('GET', '/labs', { token: stranger })).data.length, 0);
    const patch = await call('PATCH', `/labs/${created.data.id}`, {
      token: stranger,
      body: { status: 'done' },
    });
    assert.equal(patch.status, 404);
    assert.equal(
      (await call('DELETE', `/labs/${created.data.id}`, { token: stranger })).status,
      404,
    );
  });
});

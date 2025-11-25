import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000/api/auth";

test.describe("Auth API - Login", () => {

  test("✔ Should login an existing user", async ({ request }) => {
    const email = `login_${Date.now()}@example.com`;
    const password = "123456";

    // 1. Crear usuario
    const registerResponse = await request.post(`${BASE_URL}/register`, {
      data: {
        name: "Login Test",
        email,
        password,
        role: "cliente",
      },
    });

    expect(registerResponse.status()).toBe(201); // revisa si tu endpoint devuelve 201 o 200

    // 2. Loguear usuario
    const loginResponse = await request.post(`${BASE_URL}/login`, {
      data: { email, password },
    });

    expect(loginResponse.status()).toBe(200);

    const body = await loginResponse.json();

    expect(body).toHaveProperty("token");
    expect(typeof body.token).toBe("string");
  });

  test("❌ Should fail with wrong password", async ({ request }) => {
    const email = `fail_${Date.now()}@example.com`;
    const password = "123456";

    // Crear usuario válido
    await request.post(`${BASE_URL}/register`, {
      data: {
        name: "Fail Test",
        email,
        password,
        role: "cliente",
      },
    });

    // Intento con contraseña incorrecta
    const response = await request.post(`${BASE_URL}/login`, {
      data: { email, password: "wrongpass" },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty("message");
  });

  test("❌ Should fail when user does not exist", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/login`, {
      data: {
        email: "notexist@example.com",
        password: "123456",
      },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toHaveProperty("message");
  });
  
});

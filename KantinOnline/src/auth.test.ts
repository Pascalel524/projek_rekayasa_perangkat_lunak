import { beforeEach, describe, expect, it } from "vitest";
import { loginUser, registerUser, userStore } from "./auth";

describe("Auth MVP - Register & Login", () => {
  beforeEach(() => {
    Object.keys(userStore).forEach((key) => {
      delete userStore[key];
    });
  });

  it("registrasi berhasil dengan email @student.ac.id", async () => {
    const result = await registerUser("alice@student.ac.id", "123456");

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.data.email).toBe("alice@student.ac.id");
    }
  });

  it("registrasi gagal untuk email @gmail.com", async () => {
    const result = await registerUser("alice@gmail.com", "123456");

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_EMAIL_DOMAIN");
      expect(result.error.message).toContain("@student.ac.id");
    }
  });

  it("login berhasil dengan kredensial valid", async () => {
    await registerUser("bob@student.ac.id", "123456");

    const result = await loginUser("bob@student.ac.id", "123456");

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.data.authenticated).toBe(true);
    }
  });

  it("login gagal kalau password salah", async () => {
    await registerUser("charlie@student.ac.id", "123456");

    const result = await loginUser("charlie@student.ac.id", "wrongpass");

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_PASSWORD");
    }
  });
});

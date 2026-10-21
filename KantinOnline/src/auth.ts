export const STUDENT_EMAIL_DOMAIN = "@student.pradita.ac.id";
export const USER_STORAGE_KEY = "kantinonline_users";

export type AuthErrorCode =
  | "INVALID_EMAIL_DOMAIN"
  | "EMAIL_REQUIRED"
  | "PASSWORD_TOO_SHORT"
  | "USER_ALREADY_EXISTS"
  | "USER_NOT_FOUND"
  | "INVALID_PASSWORD";

export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: AuthErrorCode; message: string } };

type StoredUser = {
  email: string;
  passwordHash: string;
  createdAt: string;
};

export const userStore: Record<string, StoredUser> = {};

function isStorageAvailable(): boolean {
  return typeof globalThis !== "undefined" && typeof globalThis.localStorage !== "undefined";
}

function loadPersistedUsers(): Record<string, StoredUser> {
  if (!isStorageAvailable()) {
    return {};
  }

  try {
    const raw = globalThis.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function savePersistedUsers(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    globalThis.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userStore));
  } catch {
    // ignore storage write errors for MVP
  }
}

Object.assign(userStore, loadPersistedUsers());

export function validateStudentEmail(email: string): { valid: boolean; error?: string } {
  const normalized = email?.trim().toLowerCase();

  if (!normalized) {
    return { valid: false, error: "Email wajib diisi." };
  }

  if (!normalized.includes("@")) {
    return { valid: false, error: "Email harus mengandung tanda @." };
  }

  if (!normalized.endsWith(STUDENT_EMAIL_DOMAIN)) {
    return {
      valid: false,
      error: "Email hanya diperbolehkan menggunakan domain @student.pradita.ac.id.",
    };
  }

  return { valid: true };
}

export async function hashPassword(password: string): Promise<string> {
  if (!password || password.trim().length < 6) {
    throw new Error("Password minimal 6 karakter.");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function registerUser(
  email: string,
  password: string
): Promise<AuthResult<{ email: string }>> {
  const emailValidation = validateStudentEmail(email);

  if (!emailValidation.valid) {
    return {
      ok: false,
      error: {
        code: "INVALID_EMAIL_DOMAIN",
        message: emailValidation.error ?? "Email tidak valid.",
      },
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (password.trim().length < 6) {
    return {
      ok: false,
      error: {
        code: "PASSWORD_TOO_SHORT",
        message: "Password minimal 6 karakter.",
      },
    };
  }

  if (userStore[normalizedEmail]) {
    return {
      ok: false,
      error: {
        code: "USER_ALREADY_EXISTS",
        message: "Email sudah terdaftar.",
      },
    };
  }

  const passwordHash = await hashPassword(password);

  userStore[normalizedEmail] = {
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  savePersistedUsers();

  return {
    ok: true,
    data: { email: normalizedEmail },
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult<{ email: string; authenticated: boolean }>> {
  const emailValidation = validateStudentEmail(email);

  if (!emailValidation.valid) {
    return {
      ok: false,
      error: {
        code: "INVALID_EMAIL_DOMAIN",
        message: emailValidation.error ?? "Email tidak valid.",
      },
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = userStore[normalizedEmail];

  if (!user) {
    return {
      ok: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "Akun belum terdaftar. Silakan register terlebih dahulu.",
      },
    };
  }

  const hashedInput = await hashPassword(password);

  if (user.passwordHash !== hashedInput) {
    return {
      ok: false,
      error: {
        code: "INVALID_PASSWORD",
        message: "Password salah.",
      },
    };
  }

  return {
    ok: true,
    data: {
      email: normalizedEmail,
      authenticated: true,
    },
  };
}

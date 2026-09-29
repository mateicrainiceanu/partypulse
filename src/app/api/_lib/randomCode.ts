import crypto from "crypto";

// Cryptographically secure replacements for `random-string-alphanumeric-generator`,
// used for auth-sensitive values (OAuth placeholder passwords, verification codes,
// password-recovery codes, invite codes).

export function randomNumericCode(digits: number = 6): number {
    const max = 10 ** digits;
    const min = 10 ** (digits - 1);
    return crypto.randomInt(min, max);
}

export function randomAlphanumericCode(length: number = 20): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

export function randomPassword(): string {
    return crypto.randomBytes(32).toString("hex");
}

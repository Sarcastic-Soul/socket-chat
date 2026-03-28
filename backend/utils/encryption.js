import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Ensure we have a consistent 32-byte key for AES-256 by hashing the environment variable
// We use a fallback so your server doesn't crash, but you should add ENCRYPTION_KEY to your .env file
const keyString =
    process.env.ENCRYPTION_KEY || "default_mern_chat_secret_key_2024";
const keyBuffer = crypto
    .createHash("sha256")
    .update(String(keyString))
    .digest();

const IV_LENGTH = 16; // AES block size

export const encryptText = (text) => {
    if (!text) return text;
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        // Store the IV alongside the ciphertext so we can decrypt it later
        return iv.toString("hex") + ":" + encrypted;
    } catch (error) {
        console.error("Encryption error:", error);
        return text;
    }
};

export const decryptText = (text) => {
    if (!text) return text;
    try {
        const textParts = text.split(":");
        if (textParts.length !== 2) throw new Error("Invalid encrypted format");

        const iv = Buffer.from(textParts[0], "hex");
        if (iv.length !== IV_LENGTH) throw new Error("Invalid IV length");

        const encryptedText = Buffer.from(textParts[1], "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        return "[Message could not be decrypted]";
    }
};

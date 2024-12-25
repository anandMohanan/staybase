// lib/redis.ts
import Redis from 'ioredis';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const CACHE_TTL = 60 * 15; // 15 minutes in seconds

// Convert base64 key to buffer
const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('ENCRYPTION_KEY environment variable is not set');
    }
    // Convert base64 to buffer of exact length needed for AES-256
    return Buffer.from(key, 'base64').slice(0, 32);
};

export class SecureRedisCache {
    private redis: Redis;
    private encryptionKey: Buffer;

    constructor() {
        this.redis = new Redis(process.env.REDIS_URL || '');
        this.encryptionKey = getEncryptionKey();
    }

    private encrypt(data: any): string {
        const iv = randomBytes(12); // 12 bytes for GCM mode
        const cipher = createCipheriv(ALGORITHM, this.encryptionKey, iv);
        
        const jsonData = JSON.stringify(data);
        const encryptedData = Buffer.concat([
            cipher.update(jsonData, 'utf8'),
            cipher.final()
        ]);
        
        const authTag = cipher.getAuthTag();
        
        // Combine IV, encrypted data, and auth tag for storage
        const combined = Buffer.concat([iv, authTag, encryptedData]);
        return combined.toString('base64');
    }

    private decrypt(encryptedString: string): any {
        const combined = Buffer.from(encryptedString, 'base64');
        
        // Extract the pieces
        const iv = combined.subarray(0, 12);
        const authTag = combined.subarray(12, 28);
        const encryptedData = combined.subarray(28);
        
        const decipher = createDecipheriv(ALGORITHM, this.encryptionKey, iv);
        decipher.setAuthTag(authTag);
        
        const decrypted = Buffer.concat([
            decipher.update(encryptedData),
            decipher.final()
        ]);
        
        return JSON.parse(decrypted.toString('utf8'));
    }

    async set(key: string, data: any, ttl = CACHE_TTL): Promise<void> {
        const encryptedData = this.encrypt(data);
        await this.redis.setex(key, ttl, encryptedData);
    }

    async get(key: string): Promise<any | null> {
        const encryptedData = await this.redis.get(key);
        if (!encryptedData) return null;
        return this.decrypt(encryptedData);
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }
}

export const secureCache = new SecureRedisCache();

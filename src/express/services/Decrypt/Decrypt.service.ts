const crypto = require("crypto");
export function decrypt(data: string, SECURE: string, iv: Buffer): string {
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', SECURE, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
    
}
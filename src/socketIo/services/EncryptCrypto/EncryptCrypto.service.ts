const crypto = require("crypto")
export async function encryptCrypto(data: string, SECURE: string, iv: Buffer){
    const cipher = crypto.createCipheriv('aes-256-cbc', SECURE, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    if(!encrypted){
        throw {message: "Erro ao encriptar dados.", status: 500}
    }
    return encrypted;
}
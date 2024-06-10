import crypto from 'crypto';

export const getId = (val: string, len: number=10): string => {
    return crypto.createHash('sha256').update(val).digest('hex').substring(0, len);
}

export const randomId = (len: number = 16): string => {
    return crypto.randomBytes(len).toString('hex');
}
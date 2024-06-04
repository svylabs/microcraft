import crypto from 'crypto';

export const getId = (val: string): string => {
    return crypto.createHash('sha256').update(val).digest('hex');
}

export const randomId = (len: number = 16): string => {
    return crypto.randomBytes(len).toString('hex');
}
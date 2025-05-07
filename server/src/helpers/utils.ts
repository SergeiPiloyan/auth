import pge from 'pg-escape';
import { Md5 } from 'md5-typescript';
import { PASSWORD_HASH_SALT } from './const';

export const pgs = (s: string | number) => pge.literal(String(s));

export const hashedPassword = (password: string) => {
    return Md5.init(password + PASSWORD_HASH_SALT);
};

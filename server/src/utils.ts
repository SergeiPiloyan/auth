import pge from 'pg-escape';

export const pgs = (s: string) => pge.literal(String(s));

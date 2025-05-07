import pge from 'pg-escape';

export const pgs = (s: string | number) => pge.literal(String(s));

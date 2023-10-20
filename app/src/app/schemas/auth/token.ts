import { P } from 'ts-pattern';

export type Token = {
  access_token: string;
  token_type: string;
};

export const TokenPattern: P.Pattern<Token> = {};

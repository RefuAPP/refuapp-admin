import { P } from 'ts-pattern';

export type AdminCredentials = {
  username: string;
  password: string;
};

type Admin = {
  id: string;
} & AdminCredentials;

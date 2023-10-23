import { P } from 'ts-pattern';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export type Refuge = {
  id: string;
  name: string;
  region: string;
  image: string;
  altitude: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  capacity: {
    winter: number;
    summer: number;
  };
};

export type CreateRefuge = Omit<Refuge, 'id'>;

export const CreateRefugePattern: P.Pattern<CreateRefuge> = {};

export const RefugePattern: P.Pattern<Refuge> = {};

export function isValidId(id: string): boolean {
  return uuidValidate(id) && uuidVersion(id) === 4;
}

import * as migration_20260927_035445_initial from './20260927_035445_initial';

export const migrations = [
  {
    up: migration_20260927_035445_initial.up,
    down: migration_20260927_035445_initial.down,
    name: '20260927_035445_initial'
  },
];

import * as migration_20260712_095550_initial from './20260712_095550_initial';

export const migrations = [
  {
    up: migration_20260712_095550_initial.up,
    down: migration_20260712_095550_initial.down,
    name: '20260712_095550_initial'
  },
];

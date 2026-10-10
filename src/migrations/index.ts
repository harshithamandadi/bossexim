import * as migration_20260927_035445_initial from './20260927_035445_initial';
import * as migration_20261010_083602_insights from './20261010_083602_insights';

export const migrations = [
  {
    up: migration_20260927_035445_initial.up,
    down: migration_20260927_035445_initial.down,
    name: '20260927_035445_initial',
  },
  {
    up: migration_20261010_083602_insights.up,
    down: migration_20261010_083602_insights.down,
    name: '20261010_083602_insights'
  },
];

import * as migration_20260927_035445_initial from './20260927_035445_initial';
import * as migration_20261010_081559_site_visits from './20261010_081559_site_visits';
import * as migration_20261010_130606_assistant_questions from './20261010_130606_assistant_questions';

export const migrations = [
  {
    up: migration_20260927_035445_initial.up,
    down: migration_20260927_035445_initial.down,
    name: '20260927_035445_initial',
  },
  {
    up: migration_20261010_081559_site_visits.up,
    down: migration_20261010_081559_site_visits.down,
    name: '20261010_081559_site_visits',
  },
  {
    up: migration_20261010_130606_assistant_questions.up,
    down: migration_20261010_130606_assistant_questions.down,
    name: '20261010_130606_assistant_questions'
  },
];

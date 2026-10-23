import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-sqlite'
import { seedTeam } from '../payload/seed/data'

/**
 * Content update, no schema change: the client's own team profiles (Profile Data document,
 * 23 Oct 2026) replace the draft bios already in the live database, and Pradeep K's
 * designation becomes Chief Operating Officer. Runs once, on the next deploy.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const { name, role, bio } of seedTeam) {
    await payload.update({
      collection: 'team-members',
      where: { name: { equals: name } },
      data: { role, bio },
      req,
      context: { disableRevalidate: true },
    })
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // The earlier draft bios are not restored.
}

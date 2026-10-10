import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_visits\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`country\` text NOT NULL,
  	\`country_name\` text,
  	\`page\` text,
  	\`referrer\` text,
  	\`device\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`site_visits_country_idx\` ON \`site_visits\` (\`country\`);`)
  await db.run(sql`CREATE INDEX \`site_visits_updated_at_idx\` ON \`site_visits\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`site_visits_created_at_idx\` ON \`site_visits\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`site_visits_id\` integer REFERENCES site_visits(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_site_visits_id_idx\` ON \`payload_locked_documents_rels\` (\`site_visits_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_visits\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`enquiries_id\` integer,
  	\`enquiry_files_id\` integer,
  	\`products_id\` integer,
  	\`markets_id\` integer,
  	\`faqs_id\` integer,
  	\`team_members_id\` integer,
  	\`galleries_id\` integer,
  	\`resources_id\` integer,
  	\`group_companies_id\` integer,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`documents_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`enquiries_id\`) REFERENCES \`enquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`enquiry_files_id\`) REFERENCES \`enquiry_files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`markets_id\`) REFERENCES \`markets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_members_id\`) REFERENCES \`team_members\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`galleries_id\`) REFERENCES \`galleries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`resources_id\`) REFERENCES \`resources\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`group_companies_id\`) REFERENCES \`group_companies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`documents_id\`) REFERENCES \`documents\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "enquiries_id", "enquiry_files_id", "products_id", "markets_id", "faqs_id", "team_members_id", "galleries_id", "resources_id", "group_companies_id", "users_id", "media_id", "documents_id") SELECT "id", "order", "parent_id", "path", "enquiries_id", "enquiry_files_id", "products_id", "markets_id", "faqs_id", "team_members_id", "galleries_id", "resources_id", "group_companies_id", "users_id", "media_id", "documents_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_enquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`enquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_enquiry_files_id_idx\` ON \`payload_locked_documents_rels\` (\`enquiry_files_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_markets_id_idx\` ON \`payload_locked_documents_rels\` (\`markets_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_team_members_id_idx\` ON \`payload_locked_documents_rels\` (\`team_members_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_galleries_id_idx\` ON \`payload_locked_documents_rels\` (\`galleries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_resources_id_idx\` ON \`payload_locked_documents_rels\` (\`resources_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_group_companies_id_idx\` ON \`payload_locked_documents_rels\` (\`group_companies_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`documents_id\`);`)
}

import { Migration } from '@mikro-orm/migrations';

export class Migration20220103100730 extends Migration {
  async up(): Promise<void> {
    this.addSql('create extension if not exists citext;');

    this.addSql(
      'create table "organizations" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(3) not null default now(), "name" citext not null);',
    );
    this.addSql(
      'alter table "organizations" add constraint "organizations_pkey" primary key ("id");',
    );
    this.addSql(
      'alter table "organizations" add constraint "organizations_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "users" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(3) not null default now(), "email" citext not null, "password" text null, "full_name" text not null default \'\', "type" text check ("type" in (\'ADMIN\', \'STANDARD\')) not null default \'STANDARD\', "reset_password_token" bytea null, "reset_password_expires_at" timestamptz(3) null, "organization_id" uuid null);',
    );
    this.addSql(
      'alter table "users" add constraint "users_pkey" primary key ("id");',
    );
    this.addSql(
      'alter table "users" add constraint "users_email_unique" unique ("email");',
    );
    this.addSql(
      'alter table "users" add constraint "users_reset_password_token_unique" unique ("reset_password_token");',
    );

    this.addSql(
      'create table "sessions" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(3) not null default now(), "token" bytea not null, "expires_at" timestamptz(3) not null, "user_id" uuid not null);',
    );
    this.addSql(
      'alter table "sessions" add constraint "sessions_pkey" primary key ("id");',
    );
    this.addSql(
      'alter table "sessions" add constraint "sessions_token_unique" unique ("token");',
    );

    this.addSql(
      'alter table "users" add constraint "users_organization_id_foreign" foreign key ("organization_id") references "organizations" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "sessions" add constraint "sessions_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;',
    );
  }
}

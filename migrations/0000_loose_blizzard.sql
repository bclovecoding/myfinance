CREATE TABLE IF NOT EXISTS "accounts" (
	"id" varchar(60) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"user_id" varchar(60) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_account_idx" ON "accounts" USING btree ("user_id","name");
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"save_id" integer REFERENCES "save",
	"admin" BOOLEAN NOT NULL default 'false'
);



CREATE TABLE "save" (
	"id" serial PRIMARY KEY,
	"day" integer NOT NULL,
	"distance" integer NOT NULL,
	"food" integer NOT NULL,
	"money" integer NOT NULL,
	"fuel" integer NOT NULL,
	"resource1" integer NOT NULL,
	"resource2" integer NOT NULL,
	"resource3" integer NOT NULL,
	"resource4" integer NOT NULL,
	"resource5" integer NOT NULL,
	"crew1" TEXT NOT NULL,
	"crew2" TEXT NOT NULL,
	"crew3" TEXT NOT NULL,
	"crew4" TEXT NOT NULL,
	"crew5" TEXT NOT NULL,
	"crew1_status" BOOLEAN NOT NULL,
	"crew2_status" BOOLEAN NOT NULL,
	"crew3_status" BOOLEAN NOT NULL,
	"crew4_status" BOOLEAN NOT NULL,
	"crew5_status" BOOLEAN NOT NULL,
	"crew_compliment" integer NOT NULL
);



CREATE TABLE "scenarios" (
	"id" serial PRIMARY KEY,
	"prompt" TEXT NOT NULL,
	"option1" TEXT NOT NULL,
	"option2" TEXT NOT NULL,
	"good_outcome" TEXT NOT NULL,
	"bad_outcome" TEXT NOT NULL,
	"neutral_outcome" TEXT NOT NULL,
	"good_outcome_type_id" integer NOT NULL REFERENCES "outcome_type"(id),
	"bad_outcome_type_id" integer NOT NULL REFERENCES "outcome_type"(id),
	"neutral_outcome_type_id" integer NOT NULL REFERENCES "outcome_type"("id")
);



CREATE TABLE "outcome_type" (
	"id" serial PRIMARY KEY,
	"description" text NOT NULL,
	"day" integer,
	"distance" integer,
	"food" integer,
	"money" integer,
	"fuel" integer,
	"resource1" integer,
	"resource2" integer,
	"resource3" integer,
	"resource4" integer,
	"resource5" integer,
	"crew1_status" BOOLEAN,
	"crew2_status" BOOLEAN,
	"crew3_status" BOOLEAN,
	"crew4_status" BOOLEAN,
	"crew5_status" BOOLEAN
);
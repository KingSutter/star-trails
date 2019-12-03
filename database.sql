CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"save_id" integer REFERENCES "save",
	"admin" BOOLEAN NOT NULL default 'false'
);



CREATE TABLE "save" (
	"id" serial PRIMARY KEY,
	"day" integer NOT NULL default '0',
	"distance" real NOT NULL default '0',
	"food" integer NOT NULL,
	"money" integer NOT NULL,
	"phaser_energy" integer NOT NULL,
	"warp_coils" integer NOT NULL,
	"antimatter_flow_regulators" integer NOT NULL,
	"magnetic_constrictors" integer NOT NULL,
	"plasma_injectors" integer NOT NULL,
	"captain" TEXT NOT NULL,
	"medic" TEXT NOT NULL,
	"engineer" TEXT NOT NULL,
	"helm" TEXT NOT NULL,
	"tactical" TEXT NOT NULL,
	"captain_status" VARCHAR(20) NOT NULL default 'healthy',
	"medic_status" VARCHAR(20) NOT NULL default 'healthy',
	"engineer_status" VARCHAR(20) NOT NULL default 'healthy',
	"helm_status" VARCHAR(20) NOT NULL default 'healthy',
	"tactical_status" VARCHAR(20) NOT NULL default 'healthy'
);



CREATE TABLE "scenarios" (
	"id" serial PRIMARY KEY,
	"prompt" TEXT NOT NULL,
	"option1" TEXT NOT NULL,
	"option2" TEXT NOT NULL,
	"good_outcome" TEXT NOT NULL,
	"good_outcome_id" integer NOT NULL REFERENCES "outcomes"(id),
	"bad_outcome" TEXT NOT NULL,
	"bad_outcome_id" integer NOT NULL REFERENCES "outcomes"(id),
	"neutral_outcome" TEXT NOT NULL,
	"neutral_outcome_id" integer NOT NULL REFERENCES "outcomes"(id),
	"non_neutral_outcome" TEXT NOT NULL,
	"non_neutral_outcome_id" integer NOT NULL,
	"option1_outcomes" integer [] NOT NULL,
	"option2_outcomes" integer [] NOT NULL
);



CREATE TABLE "outcomes" (
	"id" serial PRIMARY KEY,
	"day" integer default '1',
	"distance" real default '1',
	"food" integer default '-10',
	"money" integer default '0',
	"phaser_energy" integer default '0',
	"warp_coils" integer default '0',
	"antimatter_flow_regulators" integer default '0',
	"magnetic_constrictors" integer default '0',
	"plasma_injectors" integer default '0',
	"crew_lost" integer default '0'
);
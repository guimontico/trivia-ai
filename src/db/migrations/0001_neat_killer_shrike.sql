CREATE TABLE `trivia` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`tips` text NOT NULL,
	`category` text NOT NULL,
	`difficulty` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);

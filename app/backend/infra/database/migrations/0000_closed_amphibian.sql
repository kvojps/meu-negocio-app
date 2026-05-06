CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`cost_price` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sale_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`sale_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`unit_cost` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`date` text NOT NULL,
	`total_price` real NOT NULL,
	`cost_total` real DEFAULT 0 NOT NULL,
	`gross_profit` real DEFAULT 0 NOT NULL
);

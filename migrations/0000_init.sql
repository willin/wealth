CREATE TABLE `invoices`  (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `type` TEXT NOT NULL DEFAULT '',
  `date` date NOT NULL,
  `category` TEXT NOT NULL DEFAULT '',
  `amount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
  `method` TEXT NOT NULL DEFAULT '',
  `description` TEXT NOT NULL DEFAULT '',
  `note` TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_invoices_type ON `invoices` (`type`);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON `invoices` (`date`);
CREATE INDEX IF NOT EXISTS idx_invoices_category ON `invoices` (`category`);
CREATE INDEX IF NOT EXISTS idx_invoices_amount ON `invoices` (`amount`);

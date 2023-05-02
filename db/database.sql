CREATE TABLE `invoices`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` varchar(16) NOT NULL DEFAULT '',
  `date` date NOT NULL,
  `category` varchar(32) NOT NULL DEFAULT '',
  `amount` decimal(12, 2) NOT NULL DEFAULT 0,
  `method` varchar(32) NOT NULL DEFAULT '',
  `desc` varchar(64) NOT NULL DEFAULT '',
  `note` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  INDEX(`type`),
  INDEX(`date`),
  INDEX(`category`),
  INDEX(`amount`)
);

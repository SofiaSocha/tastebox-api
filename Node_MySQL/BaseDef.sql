-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema tasteBox
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema tasteBox
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tasteBox` DEFAULT CHARACTER SET utf8 ;
USE `tasteBox` ;

-- -----------------------------------------------------
-- Table `tasteBox`.`subscription`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasteBox`.`subscription` (
  `id_subscription` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_subscription`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tasteBox`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasteBox`.`user` (
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `id_user` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role` TINYINT(0) NOT NULL,
  `subscription_id_subscription` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE INDEX `e-mail_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_user_subscription1_idx` (`subscription_id_subscription` ASC) VISIBLE,
  CONSTRAINT `fk_user_subscription1`
    FOREIGN KEY (`subscription_id_subscription`)
    REFERENCES `tasteBox`.`subscription` (`id_subscription`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tasteBox`.`recipe`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasteBox`.`recipe` (
  `id_recipe` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `difficulty_level` INT UNSIGNED NOT NULL,
  `cuisine_type` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `preparation_date` DATETIME NOT NULL,
  PRIMARY KEY (`id_recipe`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tasteBox`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasteBox`.`review` (
  `id_review` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `tags` VARCHAR(45) NULL,
  `comments` VARCHAR(255) NULL,
  `cook_it_again` TINYINT(0) NOT NULL,
  `user_id_user` INT UNSIGNED NOT NULL,
  `recipe_id_recipe` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id_review`),
  INDEX `fk_Review_User1_idx` (`user_id_user` ASC) VISIBLE,
  INDEX `fk_Review_Recipe1_idx` (`recipe_id_recipe` ASC) VISIBLE,
  CONSTRAINT `fk_Review_User1`
    FOREIGN KEY (`user_id_user`)
    REFERENCES `tasteBox`.`user` (`id_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Review_Recipe1`
    FOREIGN KEY (`recipe_id_recipe`)
    REFERENCES `tasteBox`.`recipe` (`id_recipe`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tasteBox`.`save_recipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasteBox`.`save_recipes` (
  `recipe_id_recipe` INT UNSIGNED NOT NULL,
  `user_id_user` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`recipe_id_recipe`, `user_id_user`),
  INDEX `fk_Recipe_has_User_User1_idx` (`user_id_user` ASC) VISIBLE,
  INDEX `fk_Recipe_has_User_Recipe1_idx` (`recipe_id_recipe` ASC) VISIBLE,
  CONSTRAINT `fk_Recipe_has_User_Recipe1`
    FOREIGN KEY (`recipe_id_recipe`)
    REFERENCES `tasteBox`.`recipe` (`id_recipe`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Recipe_has_User_User1`
    FOREIGN KEY (`user_id_user`)
    REFERENCES `tasteBox`.`user` (`id_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO subscription (name)
VALUES ('Gratuito');

INSERT INTO subscription (name)
VALUES ('Premium');

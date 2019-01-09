-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Jan 09, 2019 at 09:46 PM
-- Server version: 5.5.42
-- PHP Version: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `c1018db`
--

-- --------------------------------------------------------

--
-- Table structure for table `currentConnections`
--

CREATE TABLE `currentConnections` (
  `ID` int(10) unsigned NOT NULL,
  `token` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  `connected` datetime NOT NULL,
  `connectionCount` mediumint(8) unsigned NOT NULL,
  `ipAddress` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `lastConnection` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `currentConnections`
--
ALTER TABLE `currentConnections`
  ADD UNIQUE KEY `ID` (`ID`),
  ADD UNIQUE KEY `token` (`token`(4));

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `currentConnections`
--
ALTER TABLE `currentConnections`
  MODIFY `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
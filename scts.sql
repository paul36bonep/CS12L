-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2025 at 11:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scts`
--

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `AgentID` int(6) NOT NULL,
  `AgentName` varchar(50) NOT NULL,
  `Age` int(2) DEFAULT NULL,
  `CommissionPercent` float NOT NULL,
  `Area` varchar(50) NOT NULL,
  `Status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`AgentID`, `AgentName`, `Age`, `CommissionPercent`, `Area`, `Status`) VALUES
(1, 'newAgent', 27, 20, 'Davao-South', 1),
(2, 'Agent2', 29, 10, 'Davao-North', 1);

-- --------------------------------------------------------

--
-- Table structure for table `bank`
--

CREATE TABLE `bank` (
  `BankID` int(6) NOT NULL,
  `BankName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank`
--

INSERT INTO `bank` (`BankID`, `BankName`) VALUES
(2, 'banknewbank'),
(3, 'bcnp'),
(4, 'chinabank'),
(1, 'newbank');

-- --------------------------------------------------------

--
-- Table structure for table `card`
--

CREATE TABLE `card` (
  `CardID` int(6) NOT NULL,
  `TypeID` int(6) NOT NULL,
  `BankID` int(6) NOT NULL,
  `Amount` float NOT NULL,
  `Status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `card`
--

INSERT INTO `card` (`CardID`, `TypeID`, `BankID`, `Amount`, `Status`) VALUES
(1, 1, 1, 5000, 1),
(4, 2, 2, 50000, 1),
(5, 7, 3, 10000, 1),
(6, 8, 4, 465132000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cardtype`
--

CREATE TABLE `cardtype` (
  `TypeID` int(6) NOT NULL,
  `CardType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cardtype`
--

INSERT INTO `cardtype` (`TypeID`, `CardType`) VALUES
(5, 'Black2'),
(4, 'Blacker'),
(8, 'ChinaType'),
(3, 'NewBlack'),
(6, 'NewCardType'),
(1, 'newtype'),
(2, 'UltraBlack'),
(7, 'ZaNueCard');

-- --------------------------------------------------------

--
-- Table structure for table `commissions`
--

CREATE TABLE `commissions` (
  `CommissionID` int(6) NOT NULL,
  `UserID` int(6) NOT NULL,
  `AgentID` int(6) NOT NULL,
  `TotalCommission` float NOT NULL,
  `ApprovalStatus` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commissions`
--

INSERT INTO `commissions` (`CommissionID`, `UserID`, `AgentID`, `TotalCommission`, `ApprovalStatus`) VALUES
(3, 2, 1, 1000, 'Pending'),
(4, 2, 1, 8000, 'Pending'),
(5, 2, 2, 500, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `commissions_lines`
--

CREATE TABLE `commissions_lines` (
  `Coms_Lines` int(6) NOT NULL,
  `CommissionID` int(6) NOT NULL,
  `CardID` int(6) NOT NULL,
  `ClientName` varchar(50) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Amount` float NOT NULL,
  `TotalAmount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commissions_lines`
--

INSERT INTO `commissions_lines` (`Coms_Lines`, `CommissionID`, `CardID`, `ClientName`, `Quantity`, `Amount`, `TotalAmount`) VALUES
(1, 3, 1, 'Ze Client', 1, 5000, 5000),
(2, 4, 5, 'Ze Client', 4, 10000, 40000),
(3, 4, 4, 'Ze Client', 2, 50000, 100000),
(4, 5, 1, 'Ze Client', 1, 5000, 5000);

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `PositionID` int(6) NOT NULL,
  `PositionName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`PositionID`, `PositionName`) VALUES
(1, 'Owner'),
(2, 'Admin'),
(3, 'Unit Manager');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(6) NOT NULL,
  `PositionID` int(6) NOT NULL,
  `UserName` varchar(16) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `PositionID`, `UserName`, `Password`, `Name`, `Status`) VALUES
(2, 1, 'SuperAdmin', '$2y$10$z8DZLiIikQZ8pg.dE0vQnOmhhbrmn2X1nKCO4M7ROdb8zB4yd7wZe', 'ZaOwner', 1),
(3, 2, 'admin', '$2y$10$LstfFNkH5v3gMQghUrmRfuVf4Bw5J89Sn/9cwy7cBieWLy0z0pcPq', 'userAdmin', 1),
(4, 2, 'username', '$2y$10$BVkR1WOp736lSgrc0SO//u/i3y59YwTqdIGsNQ6Sa4niF8nFMV92q', 'newUser', 1),
(6, 3, 'manager', '$2y$10$oyoauC0m/MPntM6XoAV0quY8.3Z0w5K5qWsd62Bra5kPl/5eXsxfa', 'newManager', 1),
(7, 2, 'admin2', '$2y$10$67lxTEFqNxRcOkDLpUy2UusYZpIz3nH3wXxue4y/KAmvIGb0llz8u', 'admin2', 1),
(8, 2, 'admin3', '$2y$10$WI8I2m1systph74bwx164.n94cecKqW/Vu4MIkycWe.M94VNQd1jG', 'newerAdmin', 1),
(9, 2, 'admin4', '$2y$10$2LlxlWaTiP4FZAJrfDvPmuBRo2lY.vQoPiqs5gor/M/ZvZbgw0M2q', 'chingolinwoo', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`AgentID`);

--
-- Indexes for table `bank`
--
ALTER TABLE `bank`
  ADD PRIMARY KEY (`BankID`),
  ADD UNIQUE KEY `BankName` (`BankName`);

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`CardID`),
  ADD KEY `BankID` (`BankID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Indexes for table `cardtype`
--
ALTER TABLE `cardtype`
  ADD PRIMARY KEY (`TypeID`),
  ADD UNIQUE KEY `CardType` (`CardType`);

--
-- Indexes for table `commissions`
--
ALTER TABLE `commissions`
  ADD PRIMARY KEY (`CommissionID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `AgentID` (`AgentID`);

--
-- Indexes for table `commissions_lines`
--
ALTER TABLE `commissions_lines`
  ADD PRIMARY KEY (`Coms_Lines`),
  ADD KEY `CommissionID` (`CommissionID`),
  ADD KEY `CardID` (`CardID`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`PositionID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `PositionID` (`PositionID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agents`
--
ALTER TABLE `agents`
  MODIFY `AgentID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bank`
--
ALTER TABLE `bank`
  MODIFY `BankID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `card`
--
ALTER TABLE `card`
  MODIFY `CardID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cardtype`
--
ALTER TABLE `cardtype`
  MODIFY `TypeID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `commissions`
--
ALTER TABLE `commissions`
  MODIFY `CommissionID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `commissions_lines`
--
ALTER TABLE `commissions_lines`
  MODIFY `Coms_Lines` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `PositionID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `card_ibfk_1` FOREIGN KEY (`BankID`) REFERENCES `bank` (`BankID`),
  ADD CONSTRAINT `card_ibfk_2` FOREIGN KEY (`TypeID`) REFERENCES `cardtype` (`TypeID`);

--
-- Constraints for table `commissions`
--
ALTER TABLE `commissions`
  ADD CONSTRAINT `commissions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `commissions_ibfk_2` FOREIGN KEY (`AgentID`) REFERENCES `agents` (`AgentID`);

--
-- Constraints for table `commissions_lines`
--
ALTER TABLE `commissions_lines`
  ADD CONSTRAINT `commissions_lines_ibfk_1` FOREIGN KEY (`CommissionID`) REFERENCES `commissions` (`CommissionID`),
  ADD CONSTRAINT `commissions_lines_ibfk_2` FOREIGN KEY (`CardID`) REFERENCES `card` (`CardID`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`PositionID`) REFERENCES `positions` (`PositionID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

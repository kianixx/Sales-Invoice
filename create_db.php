<?php
$host = 'localhost';
$user = 'root';
$pass = '';

try {
    $dbh = new PDO("mysql:host=$host", $user, $pass);
    $dbh->exec("CREATE DATABASE IF NOT EXISTS pmc_db")
    or die(print_r($dbh->errorInfo(), true));
    echo "Database created successfully";
} catch (PDOException $e) {
    die("DB ERROR: " . $e->getMessage());
}
?>

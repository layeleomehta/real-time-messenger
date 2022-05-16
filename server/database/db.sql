-- Create database
CREATE DATABASE messenger; 

-- Create users table 
CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    username VARCHAR(28) UNIQUE NOT NULL, 
    password_hash VARCHAR NOT NULL

); 
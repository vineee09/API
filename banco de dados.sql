create database games;

use games;

create table jogos(
	id int auto_increment primary key,
    nome varchar(200),
    desenvolvedora varchar(200),
    sinopse varchar(200)
);

USE games;

CREATE TABLE generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);
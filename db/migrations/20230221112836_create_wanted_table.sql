-- migrate:up
CREATE TABLE wanted
(
    `id`    int            NOT NULL    AUTO_INCREMENT, 
    `position`  varchar(50)    NOT NULL, 
    `company`  varchar(50)    NOT NULL, 
    `link`  varchar(50)    NOT NULL, 
     PRIMARY KEY (id)
);

-- migrate:down


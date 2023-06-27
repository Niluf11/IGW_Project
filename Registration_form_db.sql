-- create extension postgis;

-- create table shops(
-- 	id serial,
-- 	shop_name varchar(250),
-- 	owner_name varchar(250),
-- 	email varchar(250),
-- 	phone varchar(250),
-- 	gender varchar(250),
-- 	geom geometry('POINT', 4326)
-- );
select shop_name, owner_name, phone, email, st_asgeojson(geom), gender from shops;
-- insert into shops(shop_name, owner_name, email,phone, gender, geom)
-- values('', '', '', '', '', st_geomfromtext('POINT( )'));
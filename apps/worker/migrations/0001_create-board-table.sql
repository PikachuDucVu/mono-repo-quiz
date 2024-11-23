-- Migration number: 0001 	 2024-11-06T16:01:54.438Z
drop table if exists board;
create table if not exists board (
  id text primary key,
  createdAt timestamp default current_timestamp
);

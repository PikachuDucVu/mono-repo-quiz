-- Migration number: 0004 	 2024-11-07T10:35:58.921Z
drop table if exists user;
create table user (
  id text primary key,
  displayName text not null,
  createdAt timestamp default current_timestamp
);
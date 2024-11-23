-- Migration number: 0002 	 2024-11-06T17:20:48.810Z
drop table if exists game;
create table if not exists game (
  id text primary key,
  status text not null default 'open',
  boardId text not null,
  createdAt timestamp default current_timestamp
);

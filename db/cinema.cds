namespace cinema;

using {cuid} from '@sap/cds/common';

entity Rooms {
  key ROOM_ID  : Integer;
      NAME     : String(64);
      CAPACITY : Integer;
};

entity Movies {
  key MOVIE_ID  : Integer;
      NAME      : String(64);
      ACTORS    : String(64);
      ROOM_NAME : String(64);
      TIME      : Integer;
};

entity Actors {
  key ID       : Integer;
      NAME     : String(64);
      MOVIE_ID : Integer;
};


entity Movie_to_room_mappings {
      DAY        : Date      @odata.Type: 'Edm.String';
      START_TIME : Timestamp @odata.Type: 'Edm.String';
      MOVIE_ID   : Association to one Movies;
  key ROOM_ID    : Association to one Rooms;
};

define view MOVIE_DETAILS as
  select
    key m.MOVIE_ID,
        m.NAME as NAME,
        m.ROOM_NAME,
        m.TIME,
        a.NAME as ACTOR_NAME
  from Movies as m
  left join Actors as a
    on m.MOVIE_ID = a.MOVIE_ID;

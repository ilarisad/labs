namespace cinema;
using {cuid} from '@sap/cds/common';

entity Rooms { 
   key ROOM_ID: Integer;
    NAME    : String(64); 
    CAPACITY : Integer; 
};

entity Movies { 
  key MOVIE_ID: Integer;
   NAME  : String(64); 
   ACTORS  : String(64); 
   ROOM_NAME: String(64); 
   TIME : Integer; 
};

entity Actors { 
 key  ID: Integer;
  NAME  : String(64); 
  MOVIE_ID: String(64); 
};


entity Movie_to_room_mappings {
    key DAY: Date @odata.Type:'Edm.String';
    key START_TIME: Timestamp @odata.Type:'Edm.String';
    key MOVIE_ID: Association to one Movies;
    key ROOM_ID: Association to one Rooms;
};

// type Genre : String enum {
//     action;
//     comedy;
//     drama;
//     fantasy;
//     horror;
//     mystery;
//     romance;
//     thriller;
// };

// type Price : Decimal(5, 2);

// entity Movies {
//     key ID    : Integer;
//         NAME  : String(64);
//         PRICE : Price;
//         GENRE : Genre;
// };




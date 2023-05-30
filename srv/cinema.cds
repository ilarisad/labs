using cinema as db from '../db/cinema';

service CinemaAdmin {
    entity Rooms as projection on db.Rooms;
    entity Actors as projection on db.Actors;
    entity Movies as projection on db.Movies;
    entity MovieToRoomMapping as projection on db.Movie_to_room_mappings;
    entity MovieDetails as projection on db.MOVIE_DETAILS;

}

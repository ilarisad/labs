const cds = require('@sap/cds');

class CinemaAdmin extends cds.ApplicationService {
    async init() {
        this.before("CREATE", "Rooms", async (req) => {
            // Check the value of capacity
            const { CAPACITY: capacity } = req.data
            if (capacity > 100) throw Error('Capacity cannot be bigger than 100!');

            // Populate ID column from database sequence
            const [{SEQ: roomId}] = await cds.run(`SELECT "room_id".nextval as SEQ FROM dummy;`);
            req.data.ID = roomId;
        })

        this.before("CREATE", "Movies", async (req) => {       
            // Populate ID column from database sequence
            const [{SEQ: movieId}] = await cds.run(`SELECT "movie_id".nextval as SEQ FROM dummy;`);
            req.data.ID = movieId;
        })
        await super.init()
    }
}
module.exports = CinemaAdmin;

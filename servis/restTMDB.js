const TMDBklijent = require("./klijentTMDB.js");

class RestTMDB {

    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
        console.log(api_kljuc);
        
        //this.tmdbKlijent.dohvatiFilm(500).then(console.log).catch(console.log);
    }

    getZanr(zahtjev, odgovor) {
        console.log(this);
        this.tmdbKlijent.dohvatiZanrove().then((zanrovi) => {
            //console.log(zanrovi);
            odgovor.type("application/json")
            odgovor.send(zanrovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }

    postFilm(zahtjev,odgovor) {
        let id_tmdb = zahtjev.query.id_tmdb;

        console.log("Usao sam u funkciju postFilm i dohvatio id filma iz tmdb baze koji je: " + id_tmdb);
        
        odgovor.type("application/json");
        this.tmdbKlijent.dohvatiFilm(id_tmdb).then((film) => {
            console.log("Vratio sam se iz funkcije dohvatiFilm i podaci za film koje sam dohvatio su: " + film);
            
            console.log("-------------------------      " + film["adult"]);
            let kDAO = new korisnikDAO();
            kDAO.dodajFilm(film).then();
            odgovor.send(JSON.stringify(film));
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }

    getFilmovi(zahtjev, odgovor) {
        console.log(this);
        odgovor.type("application/json")
        let stranica = zahtjev.query.stranica;
        let rijeci = zahtjev.query.kljucnaRijec;

        if(stranica == null || rijeci==null){
            odgovor.status("417");
            odgovor.send({greska: "neocekivani podaci"});
            return;
        } 

        this.tmdbKlijent.pretraziFilmove(rijeci,stranica).then((filmovi) => {
            //console.log(filmovi);
            odgovor.send(filmovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }
}

module.exports = RestTMDB;
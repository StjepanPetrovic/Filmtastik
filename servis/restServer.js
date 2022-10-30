const konst = require("../konstante.js");
const express = require(konst.dirModula + 'express');
const Konfiguracija = require("../konfiguracija");
const portovi = require(konst.dirPortova + "portovi_rest.js");
const restKorisnici = require("./restKorisnik.js")
const RestTMDB = require("./restTMDB");

const port = portovi.spetrovic20;
const server = express();

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju().then(pokreniServer).catch((greska) => {
    if (process.argv.length == 2)
        console.error("Potrebno je unjeti naziv datoteke!");
    else
        console.error("Naziv datoteke nije dobar: " + greska.path);
    process.exit()
});

function pokreniServer() {
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());

    pripremiPutanjeKorisnik();
    pripremiPutanjeTMDB();

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        let poruka = { greska: "Stranica nije pronađena!" }
        odgovor.json(poruka);
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

function pripremiPutanjeKorisnik(){
    server.get("/api/korisnici",restKorisnici.getKorisnici);
    server.post("/api/korisnici",restKorisnici.postKorisnici);
    server.put("/api/korisnici",restKorisnici.putKorisnici);
    server.delete("/api/korisnici",restKorisnici.deleteKorisnici);

    server.get("/api/korisnici/:korime",restKorisnici.getKorisnik);
    server.post("/api/korisnici/:korime",restKorisnici.postKorisnik);
    server.put("/api/korisnici/:korime",restKorisnici.putKorisnik);
    server.delete("/api/korisnici/:korime",restKorisnici.deleteKorisnik);
    server.post("/api/korisnici/:korime/prijava",restKorisnici.getKorisnikPrijava);
}

function pripremiPutanjeTMDB() {
    let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
    server.get("/api/tmdb/zanr",restTMDB.getZanr.bind(restTMDB));
    server.get("/api/tmdb/filmovi",restTMDB.getFilmovi.bind(restTMDB));
}


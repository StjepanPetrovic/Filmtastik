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

    server.all("/*", (zahtjev, odgovor, sljedeca) => {
        autorizacija(zahtjev, odgovor, sljedeca);
    })

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

function autorizacija(zahtjev, odgovor, sljedeca)
{
    let korime = zahtjev.query.korime;
    let lozinka = zahtjev.query.lozinka;

    if (korime == null || lozinka == null)
    {
        odgovor.status(400);
        let greska = { greska: "Niste unijeli u zahtjev korisnicko ime i/ili lozinku" }
        odgovor.json(greska);
    }
    else
    {
        const regexp_korime = /^(?=.*[A-Za-z].*[A-Za-z])(?=.*\d.*\d)[A-Za-z\d]{15,20}$/;
        const regexp_lozinka = /^(?=.*[A-Za-z].*[A-Za-z].*[A-Za-z])(?=.*?\d.*?\d.*?\d)(?=.*[!-/:-@[-`{-~].*[!-/:-@[-`{-~].*[!-/:-@[-`{-~])[!-~]{20,100}$/;

        if (!regexp_korime.test(korime) || !regexp_lozinka.test(lozinka))
        {
            odgovor.status(400);
            let greska = { greska: "Korisničko ime treba imati od 15 do 20 slova ili brojeva od čega je obavezno unijeti 2 slova i 2 broja. Lozinka treba imati od 20 do 100 slova ili brojeva ili specijalnih znakova od čega je obavezno unijeti 3 slova, 3 broja i 3 specijalna znaka." }
            odgovor.json(greska);
        }
        else
        {
            if (konf.dajKonf()['rest.korime'] != korime || konf.dajKonf()['rest.lozinka'] != lozinka)
            {
                odgovor.status(401);
                let greska = { greska: "Niste unijeli u zahtjev ispravno korisnicko ime i/ili lozinku koja je definirana u konfiguracijskoj datoteci." }
                odgovor.json(greska);
            }
            else
            {
                sljedeca();
            }
        }
    }
}

const KorisnikDAO = require("./korisnikDAO.js");

exports.nijeImplementirano = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let greska = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(greska));
}

exports.nijeDopusteno = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let greska = { greska: "metoda nije dopuštena" }
    odgovor.send(JSON.stringify(greska));
}

exports.getKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    kdao.dajSveKorisnike().then((korisnici) => {
        odgovor.send(JSON.stringify(korisnici));
    });
}

exports.postKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let podaci = zahtjev.body;
    let kdao = new KorisnikDAO();
    kdao.dodajKorisnika(podaci).then((greska) => {
        odgovor.send(JSON.stringify(greska));
    });
}

exports.getKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.dajKorisnika(korime).then((korisnik) => {
        odgovor.send(JSON.stringify(korisnik));
    });
}

exports.getKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.dajKorisnika(korime).then((korisnik) => {
        if(korisnik!=null && korisnik.lozinka==zahtjev.body.lozinka)
        {
            console.log(`Korisnik ${korime} je uspješno prijavljen.`);
            odgovor.json(`Korisnik ${korime} je uspješno prijavljen.`);
        }
        else{ 
            odgovor.status(401)
            console.log(`Neuspjesna prijava korisnika ${korime}.`);
            odgovor.send(JSON.stringify({greska: "Krivi podaci!"}))
        }
    });
}

exports.putKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let korime = zahtjev.params.korime;
    let podaci = zahtjev.body;
    let kdao = new KorisnikDAO();
    kdao.azurirajKorisnika(korime, podaci).then((greska) => {
        odgovor.send(JSON.stringify(greska));
    });
}

exports.putAktivacijaKorisnika = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let korime = zahtjev.params.korime;
    let kdao = new KorisnikDAO();
    kdao.aktivirajKorisnika(korime).then((greska) => {
        odgovor.send(JSON.stringify(greska));
    });
}

exports.getFilmovi = function (zahtjev, odgovor) { // TO DO
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let podaci = zahtjev.query;
    kdao.dajFilmove(podaci).then((filmovi) => {
        odgovor.send(JSON.stringify(filmovi));
    });
}

exports.getFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let idFilm = zahtjev.params.id;
    kdao.dajFilm(idFilm).then((film) => {
        odgovor.send(JSON.stringify(film));
    });
}

exports.putFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let idFilm = zahtjev.params.id;
    let podaci = zahtjev.body;
    let kdao = new KorisnikDAO();
    kdao.azurirajFilm(idFilm, podaci).then((greska) => {
        odgovor.send(JSON.stringify(greska));
    });
}

exports.deleteFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let idFilm = zahtjev.params.id;
    let kdao = new KorisnikDAO();
    kdao.obrisiFilm(idFilm).then((greska) => {
        odgovor.send(JSON.stringify(greska));
    });
}

exports.getZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    kdao.dajSveZanrove().then((zanrovi) => {
        odgovor.send(JSON.stringify(zanrovi));
    });
}

exports.getZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let idZanr = zahtjev.params.id;
    kdao.dajZanr(idZanr).then((zanr) => {
        odgovor.send(JSON.stringify(zanr));
    });
}

exports.putZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let idZanr = zahtjev.params.id;
    let podaci = zahtjev.body;
    let kdao = new KorisnikDAO();
    kdao.azurirajZanr(idZanr, podaci).then((greska) => {
        odgovor.send(JSON.stringify(greska));
    });
}

exports.deleteZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let idZanr = zahtjev.params.id;
    let kdao = new KorisnikDAO();
    kdao.obrisiZanr(idZanr).then((greska) => {
        odgovor.send(JSON.stringify(greska));
    });
}

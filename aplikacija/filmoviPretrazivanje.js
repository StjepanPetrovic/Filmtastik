const konst = require("../konstante.js");
const portRest = require(konst.dirPortova + "portovi_rest.js").spetrovic20;
const url = "http://spider.foi.hr:" + portRest + "/api";
const kodovi = require("./moduli/kodovi.js")
class FilmoviZanroviPretrazivanje {

    async dohvatiFilmove(stranica, kljucnaRijec = "") {
        let putanja = url + "/tmdb/filmovi?stranica=" + stranica + "&kljucnaRijec=" + kljucnaRijec
        console.log(putanja)
        let odgovor = await fetch(putanja);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        console.log(filmovi)
        return filmovi;
    }

    async dohvatiSveZanrove() {
        //TODO čitaj iz ispravnog servisa
        let odgovor = await fetch(url + "/tmdb/zanr");
        let podaci = await odgovor.text();
        console.log(podaci);
        let zanrovi = JSON.parse(podaci).genres;
        return zanrovi;
    }

    async dohvatiNasumceFilm(zanr) {
        //TODO čitaj iz ispravnog servisa
        let odgovor = await fetch(url + "/tmdb/filmovi?stranica=1&kljucnaRijec=love");
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        let rez = [filmovi.results[kodovi.dajNasumceBroj(0,20)],
                    filmovi.results[kodovi.dajNasumceBroj(0,20)]];
        return rez;
    }

}

module.exports = FilmoviZanroviPretrazivanje;
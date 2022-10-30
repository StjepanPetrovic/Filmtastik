const konst = require("../konstante.js");
const mail = require("./moduli/mail.js")
const kodovi = require("./moduli/kodovi.js")
const portRest = require(konst.dirPortova + "portovi_rest.js").spetrovic20;
const totp = require("./moduli/totp.js")

class Autentifikacija
{
    async dodajKorisnika(korisnik)
    {
        let tijelo =
        {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
            email: korisnik.email,
            korime: korisnik.korime
        };

        let aktivacijskiKod = kodovi.dajNasumceBroj(10000, 99999);
        tijelo["aktivacijskiKod"] = aktivacijskiKod;
        let tajniTOTPkljuc = totp.kreirajTajniKljuc(korisnik.korime);
        tijelo["TOTPkljuc"] = tajniTOTPkljuc;

        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri =
        {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }

        let odgovor = await fetch("http://spider.foi.hr:" + portRest + "/api/korisnici", parametri)

        if (odgovor.status == 200)
        {
            console.log("Korisnik ubačen na servisu");
            let mailPoruka = "aktivacijski kod:" + aktivacijskiKod
                + " http://spider.foi.hr:12147/aktivacijaRacuna?korime=" + korisnik.korime + "&kod=" + aktivacijskiKod
            mailPoruka += " TOTP Kljuc: " + tajniTOTPkljuc;
            let poruka = await mail.posaljiMail("spetrovic20@foi.hr", korisnik.email,
                "Aktivacijski kod", mailPoruka);
            return true;
        }
        else
        {
            console.log(odgovor.status);
            console.log(await odgovor.text());
            return false;
        }
    }

    async aktivirajKorisnickiRacun(korime, kod)
    {
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        let parametri =
        {
            method: 'PUT',
            body: JSON.stringify({ aktivacijskiKod: kod }),
            headers: zaglavlje
        }

        return await fetch("http://spider.foi.hr:" + portRest + "/api/korisnici/" + korime + "/aktivacija", parametri)
    }

    async prijaviKorisnika(korime, lozinka) {
        lozinka = kodovi.kreirajSHA256(lozinka, "moja sol");
        let tijelo = {
            lozinka: lozinka,
        };
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        console.log("http://spider.foi.hr:" + portRest + "/api/korisnici/" + korime + "/prijava")
        let odgovor = await fetch("http://spider.foi.hr:" + portRest + "/api/korisnici/" + korime + "/prijava", parametri)

        if (odgovor.status == 200) {
            return await odgovor.text();
        } else {
            return false;
        }
    }

}

module.exports = Autentifikacija;
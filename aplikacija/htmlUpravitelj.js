const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js")
const totp = require("./moduli/totp.js")
const Autentifikacija = require("./autentifikacija.js")
let auth = new Autentifikacija();

exports.pocetna = async function (zahtjev, odgovor) {
    let pocetna = await ucitajStranicu("pocetna")
    odgovor.send(pocetna);
}

exports.registracija = async function (zahtjev, odgovor) {
    console.log(zahtjev.body)
    let greska = "";
    if (zahtjev.method == "POST") {
        let uspjeh = await auth.dodajKorisnika(zahtjev.body);
        if (uspjeh) {
            odgovor.redirect("/prijava");
            return;
        } else {
            greska = "Dodavanje nije uspjelo provjerite podatke!";
        }
    }

    let stranica = await ucitajStranicu("registracija", greska);
    odgovor.send(stranica);
}

exports.odjava = async function (zahtjev, odgovor) {
    zahtjev.session.korisnik = null;
    odgovor.redirect("/");
};

exports.prijava = async function (zahtjev, odgovor) {
    let greska = ""
    if (zahtjev.method == "POST") {
        var korime = zahtjev.body.korime;
        var lozinka = zahtjev.body.lozinka;
        var korisnik = await auth.prijaviKorisnika(korime, lozinka);
        console.log(korisnik)
        if (korisnik) {
            //TODO provjeri da li je račun aktiviran
            let totpKljuc = "AIBRAAADAMARTBIBARDAACAJAACREAAJBACRCBADA5ARTAAABAAACAAFAREAGCAIAAAATBAIAMAAIAACARBRKAAABEAAAAAIBEAAOBR";
            //TODO izvadi kljuc iz baze
            let totpKod = zahtjev.body.totp;
            if (!totp.provjeriTOTP(totpKod, totpKljuc)) {
                greska = "TOTP nije dobar!"
            } else {
                zahtjev.session.jwt = jwt.kreirajToken(korisnik)
                zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
                zahtjev.session.korime = korisnik.korime;
                odgovor.redirect("/");
                return;
            }
        } else {
            greska = "Netocni podaci!";
        }
    }

    let stranica = await ucitajStranicu("prijava", greska);
    odgovor.send(stranica);
}


exports.filmoviPretrazivanje = async function (zahtjev, odgovor) {
    let stranica = await ucitajStranicu("filmovi_pretrazivanje");
    odgovor.send(stranica);
}

async function ucitajStranicu(nazivStranice, poruka = "") {
    let stranice = [ucitajHTML(nazivStranice),
    ucitajHTML("navigacija")];
    let [stranica, nav] = await Promise.all(stranice);
    stranica = stranica.replace("#navigacija#", nav);
    stranica = stranica.replace("#poruka#", poruka)
    return stranica;
}

function ucitajHTML(htmlStranica) {
    return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}
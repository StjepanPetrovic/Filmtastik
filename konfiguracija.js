const ds = require("fs/promises");

class Konfiguracija {
    constructor() {
        this.konf = {}
    }

    dajKonf() {
        return this.konf;
    }

    async ucitajKonfiguraciju() {
        var podaci = await ds.readFile(process.argv[2], "UTF-8");
        this.konf = pretvoriJSONkonfig(podaci);

        let korime = this.konf['rest.korime'];
        let lozinka = this.konf['rest.lozinka'];
        let broj_stranica = this.konf['app.broj.stranica'];

        const regexp_korime = /^(?=.*[A-Za-z].*[A-Za-z])(?=.*\d.*\d)[A-Za-z\d]{15,20}$/;
        const regexp_lozinka = /^(?=.*[A-Za-z].*[A-Za-z].*[A-Za-z])(?=.*?\d.*?\d.*?\d)(?=.*[!-/:-@[-`{-~].*[!-/:-@[-`{-~].*[!-/:-@[-`{-~])[!-~]{20,100}$/;
        const regexp_broj_stranica = /^([5-9]|[1-9][0-9]|100)$/;

        if (this.konf["rest.korime"])
        {
            if (!regexp_korime.test(korime))
            {
                console.error("\nUPOZORENJE: Korisničko ime treba imati od 15 do 20 slova ili brojeva od čega je obavezno unijeti 2 slova i 2 broja\n");
                process.exit()
            }
        }
        else
        {
            console.error("UPOZORENJE: Korisnicko ime ne postoji");
            process.exit()
        }

        if (this.konf["rest.lozinka"])
        {
            if (!regexp_lozinka.test(lozinka))
            {
                console.error("\nUPOZORENJE: Lozinka treba imati od 20 do 100 slova ili brojeva ili specijalnih znakova od čega je obavezno unijeti 3 slova, 2 broja i 3 specijalna znaka\n");
                process.exit()
            }
        }
        else
        {
            console.error("UPOZORENJE: Lozinka ne postoji");
            process.exit()
        }

        if (this.konf["app.broj.stranica"])
        {
            if (!regexp_broj_stranica.test(broj_stranica))
            {
                console.error("\nUPOZORENJE: Broj stranica treba biti u intervalu od 5 do 100\n");
                process.exit()
            }
        }
        else
        {
            console.error("UPOZORENJE: Broj stranica ne postoji");
            process.exit()
        }
    }
}

function pretvoriJSONkonfig(podaci) {
    let konf = {};
    var nizPodataka = podaci.split("\n");
    for (let podatak of nizPodataka) {
        var podatakNiz = podatak.split("=");
        var naziv = podatakNiz[0];
        var vrijednost = podatakNiz[1];
        konf[naziv] = vrijednost;
    }
    return konf;
}

module.exports=Konfiguracija;
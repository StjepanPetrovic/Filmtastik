const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza();
	}

	dajSveKorisnike = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	dajKorisnika = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodajKorisnika = async function (korisnik) {
		console.log(korisnik)
		let sql = `INSERT INTO korisnik (ime,prezime,lozinka,email,korime,uloga_id) VALUES (?,?,?,?,?,?)`;
        let podaci = [korisnik.ime,korisnik.prezime,
                      korisnik.lozinka,korisnik.email,korisnik.korime,1];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	obrisiKorisnika = async function (korime) {
		let sql = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql,[korime]);
		return true;
	}

	azurirajKorisnika = async function (korime, korisnik) {
		let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=?, email=? WHERE id=?`;
        let podaci = [korisnik.ime,korisnik.prezime,
                      korisnik.lozinka,korisnik.email,korime];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	aktivirajKorisnika = async function (korime) {
		let sql = `UPDATE korisnik SET aktiviran=true WHERE korime=?`;
		await this.baza.izvrsiUpit(sql, [korime]);
		return true;
	}

	dajFilmove = async function (podaciURL) {
		let sqlWhere = "";
		if (podaciURL.datum) sqlWherefilter = `WHERE datum_unosa=${podaciURL.datum} `;
		else if (podaciURL.naziv) sqlWherefilter = `WHERE naziv=${podaciURL.naziv} `;
		else if (podaciURL.zanr)
		{
			// TO DO zanr
		}
		
		let sqlOrderBy = "";
		if (podaciURL.sortiraj == 'd') sqlOrderBy = `ORDER BY datum_unosa `;
		else if (podaciURL.sortiraj == 'n') sqlOrderBy = `ORDER BY naziv `;
		else if (podaciURL.sortiraj == 'z')
		{
			// TO DO zanr
		}
		
		this.baza.spojiSeNaBazu();
		let sql = `SELECT * FROM film ${sqlWhere}${sqlOrderBy}limit ? offset ?`;
		let podaci = [podaciURL.brojFilmova, podaciURL.stranica];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	dodajFilm = async function (film) {
		let sql = `INSERT INTO film (id_tmdb,naziv,prihod,trajanje) VALUES (?,?,?,?)`;
		console.log("Ovo je film  " + film['id']);
		let podaci = [film.id, film.original_title, film.revenue, film.runtime];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	dajFilm = async function (idFilm) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM film WHERE id=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [idFilm]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	azurirajFilm = async function (idFilm, film) { // TO DO dodati ostale atribute
		let sql = `UPDATE film SET korisnik_id=?, id_tmdb=?, id_imdb=?, prijedlog_odobren=? WHERE id=?`;
        let podaci = [film.korisnik_id,film.id_tmdb,
			film.id_imdb,film.prijedlog_odobren,idFilm];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	obrisiFilm = async function (idFilm) {
		let sql = "DELETE FROM film WHERE id=?";
		await this.baza.izvrsiUpit(sql,[idFilm]);
		return true;
	}

	dajSveZanrove = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM zanr;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	dajZanr = async function (idZanr) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM zanr WHERE id=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [idZanr]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	azurirajZanr = async function (idZanr, zanr) {
		let sql = `UPDATE zanr SET id_tmdb=?, naziv=? WHERE id=?`;
        let podaci = [zanr.id_tmdb,zanr.naziv,idZanr];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
	
	obrisiZanr = async function (iZanr) {
		let sql = "DELETE FROM zanr WHERE id=?";
		await this.baza.izvrsiUpit(sql,[iZanr]);
		return true;
	}
}

module.exports = KorisnikDAO;
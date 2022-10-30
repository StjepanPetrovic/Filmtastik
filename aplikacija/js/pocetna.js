let url = "http://spider.foi.hr:12147";

window.addEventListener("load",async ()=>{
    let main = document.getElementsByTagName("main")[0];
    let prikaz = "<ol>";
    //console.log(await dohvatiFilmove("love",1));
    for(let p of await dohvatiZanrove()){
        prikaz+="<li>"+p.name;
        let filmovi = await dohvatiFilmove(p.name);
        prikaz+="<ul>";
            prikaz+="<li>"+filmovi[0]["original_title"]+"</li>"
            prikaz+="<li>"+filmovi[1]["original_title"]+"</li>"
        prikaz+="</ul></li>"    
    }
    main.innerHTML = prikaz+"</ol>";
});

async function dohvatiZanrove(){
    let odgovor = await fetch(url+"/dajSveZanrove");
    let podaci = await odgovor.text();
    console.log(podaci);
    let zanrovi = JSON.parse(podaci);
    return zanrovi;
}

async function dohvatiFilmove(zanr){
    let odgovor = await fetch(url+"/dajDvaFilma?zanr="+zanr);
    let podaci = await odgovor.text();
    let filmovi = JSON.parse(podaci);
    return filmovi;
}

const math = window.math;

var rez;
//uzimanje id potrebnih HTML elemenata
var racunaj = document.getElementById("racunaj");
var ispis = document.getElementById("rezic");
var ispis_ci = document.getElementById("cijeliBr");
var red;
var trigger;
//funkcija koja se izvršava klikom na gumb
function rijesiJednadzbu() {
    
    try {
        //uzima se id polja gdje je korisnik upisivao jednadzbu
        var jednadzba = document.getElementById("jednadzba").value;

        //matrice se uzimaju iz polja i pretvaraju u string
        var matrica_a = matricaA();
        var matrica_b = matricaB();
        
        //matrice se iz stringa pretvaraju u matricu s kojom funkcija trans() može računat te se natrag pretvaraju u string
        var trans_a = matrixString(trans(stringMatrix(matrica_a)));
        var trans_b = matrixString(trans(stringMatrix(matrica_b)));
        
        //matrice se iz stringa pretvaraju u matricu s kojom funkcija determinanta() može računat te se natrag pretvaraju u string pomoću JSON.stringify
        //JSON.stringify može pretvoriti ne samo iz matrice u string nego bilo koji broj u string.

        //provjerava se je li matrica a kvadratna i ako je izvršava se računanje determinante
        if((stringMatrix(matrica_a))[0].length === (stringMatrix(matrica_a)).length){
            var det_a = JSON.stringify(determinanta(stringMatrix(matrica_a)));
            jednadzba = jednadzba.replace(/DetM1/g, det_a);
        }

        //provjerava se je li matrica b kvadratna i ako je izvršava se računanje determinante
        if((stringMatrix(matrica_b))[0].length === (stringMatrix(matrica_b)).length){
            var det_b = JSON.stringify(determinanta(stringMatrix(matrica_b)));
            jednadzba = jednadzba.replace(/DetM2/g, det_b);
        }
        
        //gledaju se prvo u jednadžbi koju je korinsik zapisao je li postoje funkcije Trans i Det
        //ako postoje prvo se one mijenjaju sa izračunatim vrijednostima jer, ako promijenimo prvo M1 to jest M2, u varijabli više neće postojati TransM1 nego izračunata vrijednost transponirane M1 matrice u obliku [[],[],[]]
        
        jednadzba = jednadzba.replace(/TransM1/g, trans_a);
        jednadzba = jednadzba.replace(/TransM2/g, trans_b);
        
        jednadzba = jednadzba.replace(/M1/g, matrica_a);
        jednadzba = jednadzba.replace(/M2/g, matrica_b);
        
        
        //funkcija math.evaluate() je iz drugog library-a i bilo bi prekomplicirano samostalno uzimat iz izraza vrijednosti i računati
        //funkcija računa cijelu jednadžbu kada je sve potrebno zamijenjeno
        const result = math.evaluate(jednadzba);
        
        //rezultat se sprema na local disku pod nazivom "rezultat" zbog osježavanja stranice prilikom pritiska na gumb i resetiranja podataka
        localStorage.setItem("rezultat", result);
        trigger = false;
    } catch (error) {
        //ako se u procesu dogodi greška ispisat će se poruka:
        alert('Upisao si krivo matricu/jednadžbu:', error.message);
        trigger =  true;
    }
}

//addEventListener gleda kada će se u formu u HTML kliknuti gumb izračunaj
racunaj.addEventListener("submit", function(event){
    //kada se to dogodi vrijednosti save-a na local disk
    event.preventDefault();
    //aktivira se funkcija rijesiJednadzbu() u kojem se riješi jednadzba
    rijesiJednadzbu();
    //uzima se dobiveni rezultat
    var pohrana = localStorage.getItem("rezultat");
    //U SLUČAJU DA JE REZULTAT VALIDAN, a je u 99,99999999% slučajeva jer uvijek ispiše pogrešku na ekran...
    if(pohrana && !trigger){ 
        //pretvara se rezultat dobiveni iz stringa u broj/matricu
        let str = JSON.parse(pohrana);
        //u slučaju dda je rezultat matrica izvršava se sljedeći kod:
        if(Array.isArray(str)){
            //uređuje se CSS pomoću HTML
            ispis.style.visibility = "visible";
            ispis_ci.style.visibility = "hidden";
            //u prazne elemente matrice se dodaju null vrijednosti kako ne bi stranica izgledala "spigano" :)
            for(let i = str.length; i <= 4; i++){
                str.push([null,null,null,null]);
            }
            //provjerava se svaki red
            for(let i = 0; i < 4; i++){
                //provjerava se svaki stupac
                for(let j = 0; j < 4; j++){
                    //uzima se id svakog polja
                    let id = "rez" + i + j;
                    red = document.getElementById(id);
                    //ako je element u matrici definiran, element se dodaje polju, u suprtnom se dodaje razmak kako stranica ne bi izgledala "spigano" :)
                    if(str[i][j] != null){
                        rez = str[i][j];
                        red.innerHTML = rez;
                    }else{
                        red.innerHTML = "&#xA0";
                    }
                }

            }
        }else{
            //u slučaju da je rezultat cijeli broj, a ne matrica, ispisuje se sljedeće:
            ispis_ci.style.visibility = "visible";
            ispis.style.visibility = "hidden";
            ispis_ci.innerHTML = "Rezultat: " + str;
        }
    }else{
        ispis_ci.style.visibility = "hidden";
        ispis.style.visibility = "hidden";
    }
});

//funkcija računa determinantu upisane matrice
function determinanta(matrica) {
    //uzima se broj redova iz matrice
    const redovi = matrica.length;
    //uzima se broj stupaca
    const stupci = matrica[0].length;

    //provjerava je li je matrica kvadratna
    if (redovi !== stupci) {
        throw new Error('Matrica mora biti kvadratna.');
    }

    //ako je matrica 1x1, vrijednost determinante je taj element
    if (redovi === 1) {
        return matrica[0][0];
    }

    let det = 0;
    for (let j = 0; j < stupci; j++) {
        det += matrica[0][j] * kofaktor(matrica, 0, j);
    }

    return det;
}

//funkcija za izračunavanje kofaktora za određeni element matrice
function kofaktor(matrica, red, stupac) {
    const podmatrica = matrica
        .map(red => red.slice(0)) //kloniranje matrice
        .filter((_, i) => i !== red) //uklanjanje reda
        .map(subred => subred.filter((_, j) => j !== stupac)); //uklanjanje stupca

    const znak = (red + stupac) % 2 === 0 ? 1 : -1;

    return znak * determinanta(podmatrica);
}

//funkcija za pretvaranje matrice u string (koristi samo trans_a i trans_b)
function matrixString(matrica) {
    if (!Array.isArray(matrica) || matrica.length === 0 || !Array.isArray(matrica[0])) {
        return "[]";
    }

    let matrixString = "[" + matrica.map(row => "[" + row.join(",") + "]").join(",") + "]";

    return matrixString;
}
//funkcija za pretvaranje stringa u matricu (koristi samo trans_a i trans_b)
function stringMatrix(str) {
    try {
        str = str.trim().replace(/^\[|\]$/g, '');

        const rows = str.split('],[');

        const matrix = rows.map(row => {
            row = row.replace(/^\[|\]$/g, '');

            return row.split(',').map(Number);
        });

        return matrix;
    } catch (error) {
        throw new Error('Nije moguće pretvoriti string u matricu.');
    }
}

//transponiranje matrica
function trans(matrica){
    let rez = [];
    let rez_red = [];

    //provjerava svaki stupac
    for(let i = 0; i < matrica[0].length; i++){

        //provjerava svaki red i mjenja stupce i retke
        for(let j = 0; j < matrica.length; j++){
            rez_red.push(matrica[j][i]);
        }
        rez.push(rez_red);
        rez_red = [];
    }

    return rez;
}

//funkcija uzima vrijednosti iz HTML i pretvara u string
function matricaA(){

    let rez = '[';
    let rez_red = [];

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            //uzima se id HTML elementa
            let id = "A" + i + j;
            //uzima se njegova vrijednost i dodaje se u red
            let element = document.getElementById(id).value;
            if (isNumber(element) &&  element !== ""){
                rez_red.push(element);
            }
        }
        //red se pretvara u string i dodaje u matricu
        if(rez_red.length !== 0){
            let text = '[' + rez_red + '],';
            rez += text;
        }
        
        rez_red = [];
        
    }
    //briše se zarez sa zadnjeg elementa i dodaje zagrada -> matrica sada izgleda ovako [[],[],[]] i spremna je za računanje
    rez = rez.slice(0, -1);
    rez += ']';
    return rez;
}

//funkcija uzima vrijednosti iz HTML i pretvara u string
function matricaB(){

    let rez = '[';
    let rez_red = [];

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            //uzima se id HTML elementa
            var id = "B" + i + j;
            //uzima se njegova vrijednost i dodaje se u red
            var element = document.getElementById(id).value;
            if (isNumber(element) &&  element !== ""){
                rez_red.push(element);
            }
        }
        //red se pretvara u string i dodaje u matricu
        if(rez_red.length !== 0){
            let text = '[' + rez_red + '],';
            rez += text;
        }
        
        rez_red = [];
        
    }
    //briše se zarez sa zadnjeg elementa i dodaje zagrada -> matrica sada izgleda ovako [[],[],[]] i spremna je za računanje
    rez = rez.slice(0, -1);
    rez += ']';
    return rez;
}

//funkcija provjerava je li broj u stringu broj ili ima i druge znakove !isNan -> različito od is Not a Number = is Number
function isNumber(value) {
    return !isNaN(value);
}

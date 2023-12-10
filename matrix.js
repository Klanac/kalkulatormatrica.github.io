const math = window.math;

var rez;
var racunaj = document.getElementById("racunaj");
var ispis = document.getElementById("rezic");
var ispis_ci = document.getElementById("cijeliBr");
var red;

function rijesiJednadzbu() {
    
    var jednadzba = document.getElementById("jednadzba").value;
    
    try {
        var matrica_a = matricaA();
        var matrica_b = matricaB();
        jednadzba = jednadzba.replace(/M1/g, matrica_a);
        jednadzba = jednadzba.replace(/M2/g, matrica_b);
        
        const result = math.evaluate(jednadzba);
        
        
        localStorage.setItem("rezultat", result);
        
        
    } catch (error) {
        alert('Upisao si krivo matricu/jednadžbu:', error.message);
        
    }
}

racunaj.addEventListener("submit", function(event){
    event.preventDefault();
    rijesiJednadzbu();
    var pohrana = localStorage.getItem("rezultat");
    if(pohrana){ 
        let str = JSON.parse(pohrana);
        if(Array.isArray(str)){
            ispis.style.visibility = "visible";
            ispis_ci.style.visibility = "hidden";
            for(let i = str.length; i <= 4; i++){
                str.push([null,null,null,null]);
            }
            for(let i = 0; i < 4; i++){
                for(let j = 0; j < 4; j++){
                    let id = "rez" + i + j;
                    red = document.getElementById(id);
                    if(str[i][j] != null){
                        rez = str[i][j];
                        red.innerHTML = rez;
                    }else{
                        red.innerHTML = "&#xA0";
                    }
                }

            }
        }else{
            ispis_ci.style.visibility = "visible";
            ispis.style.visibility = "hidden";
            ispis_ci.innerHTML = "Rezultat: " + str;
        }
    }
});

function matricaA(){

    let rez = '[';
    let rez_red = [];

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            let id = "A" + i + j;
            let element = document.getElementById(id).value;
            if (isNumber(element) &&  element !== ""){
                rez_red.push(element);
            }
        }
        if(rez_red.length !== 0){
            let text = '[' + rez_red + '],';
            rez += text;
        }
        
        rez_red = [];
        
    }
    rez = rez.slice(0, -1);
    rez += ']';
    return rez;
}

function matricaB(){

    let rez = '[';
    let rez_red = [];

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            var id = "B" + i + j;
            var element = document.getElementById(id).value;
            if (isNumber(element) &&  element !== ""){
                rez_red.push(element);
            }
        }
        if(rez_red.length !== 0){
            let text = '[' + rez_red + '],';
            rez += text;
        }
        
        rez_red = [];
        
    }
    rez = rez.slice(0, -1);
    rez += ']';
    return rez;
}

function isNumber(value) {
    return !isNaN(value);
}
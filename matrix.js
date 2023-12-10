const math = window.math;

function rijesiJednadzbu() {

    var jednadzba = document.getElementById("jednadzba").value;

    try {
        var matrica_a = matricaA();
        var matrica_b = matricaB();
        jednadzba = jednadzba.replace(/M1/g, matrica_a);
        jednadzba = jednadzba.replace(/M2/g, matrica_b);

        const result = math.evaluate(jednadzba);

        alert(result);
    } catch (error) {
        alert('Error:', error.message);
    }
}

function matricaA(){

    var rez = '[';
    var rez_red = [];

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            var id = "A" + i + j;
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

function matricaB(){

    var rez = '[';
    var rez_red = [];

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

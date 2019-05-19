//várivel global para guardar json do XML
var json;

$(document).ready(function () {
    getAPI();
});

function getAPI() {
    $.ajax({
        url: 'http://servicos.cptec.inpe.br/XML/cidade/7dias/244/previsao.xml',
        method: 'GET',
        dataType: 'xml',
        success: function (data) {
            // convertendo para json
            json = xmlToJson(data);

            //usando return do json
            showClimates(json);
        },
        fail: function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        }
    })
}

function showClimates(json) {
    //size previsão tagname
    var i = (json["cidade"]["previsao"]).length;

    for (let index = 0; index < i; index++) {
        var data = (json["cidade"]["previsao"][index]["dia"]);
        $('#op' + (index + 1) + '').text(data.split('-').reverse().join('/').substring(0, (data.length - 5)));
    }

    var x = 0;
    let j = getValue(x, json);

}


function getValue(value, json) {
    //alert(value);
    if (value != undefined) {
        x = value;
    }

    var tempo = siglas((json["cidade"]["previsao"][x]["tempo"]));

    $("#data").text(json["cidade"]["previsao"][x]["dia"].split('-').reverse().join('/'));
    $("#tempo").text(tempo);
    $("#max").text(json["cidade"]["previsao"][x]["maxima"] + "º");
    $("#min").text(json["cidade"]["previsao"][x]["minima"] + "º");

}


// metodo para converter xml to json
function xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    } else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }

    return obj;
}


function siglas(params) {


    var sg = {
        'ec': "Encoberto com Chuvas Isoladas",
        'ci': "Chuvas Isoladas",
        'c': "Chuva",
        'in': "Instável",
        'pp': "Poss. de Pancadas de Chuva",
        'cm': "Chuva pela Manhã",
        'cn': "Chuva a Noite",
        'pt': "Pancadas de Chuva a Tarde",
        'pm': "Pancadas de Chuva pela Manhã",
        'np': "Nublado e Pancadas de Chuva",
        'pc': "Pancadas de Chuva",
        'pn': "Parcialmente Nublado",
        'cv': "Chuvisco",
        'ch': "Chuvoso",
        't': "Tempestade",
        'ps': "Predomínio de Sol",
        'e': "Encoberto",
        'n': "Nublado",
        'cl': "Céu Claro",
        'nv': "Nevoeiro",
        'g': "Geada",
        'ne': "Neve",
        'nd': "Não Definido",
        'pnt': "Pancadas de Chuva a Noite",
        'psc': "Possibilidade de Chuva",
        'pcm': "Possibilidade de Chuva pela Manhã",
        'pct': "Possibilidade de Chuva a Tarde",
        'pcn': "Possibilidade de Chuva a Noite",
        'npt': "Nublado com Pancadas a Tarde",
        'npn': "Nublado com Pancadas a Noite",
        'ncn': "Nublado com Poss. de Chuva a Noite",
        'nct': "Nublado com Poss. de Chuva a Tarde",
        'ncm': "Nubl. c/ Poss. de Chuva pela Manhã",
        'npm': "Nublado com Pancadas pela Manhã",
        'npp': "Nublado com Possibilidade de Chuva",
        'vn': "Variação de Nebulosidade",
        'ct': "Chuva a Tarde",
        'ppn': "Poss. de Panc. de Chuva a Noite",
        'ppt': "Poss. de Panc. de Chuva a Tarde",
        'ppm': "Poss. de Panc. de Chuva pela Manhã"
    }

    return sg[params];

}
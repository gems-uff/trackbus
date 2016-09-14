angular
.module('URLConstants', [])
.constant("URL",
    {
        //Local
        "BASE": "http://localhost:8000/",

        //Local Network
        //"BASE": "",

        //Homolog
        //"BASE": "",

        "DATA_RIO": {
        	"ONIBUS1": "http://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/onibus",
        	"ONIBUS2": "http://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/onibus2"
        }
    }
);

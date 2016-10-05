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
        	"ONIBUS2": "http://dadosabertos.rio.rj.gov.br/apiTransporte/apresentacao/rest/index.cfm/onibus2",
            "BUS_STOP": {
                "BASE":"http://dadosabertos.rio.rj.gov.br/apiTransporte/Apresentacao/csv/gtfs/onibus/paradas/",
                "BEFORE_LINE": "gtfs_linha",
                "AFTER_LINE": "-paradas.csv"
            }
        },
    }
);

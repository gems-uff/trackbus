angular.module('trackbus')
.constant("ERROR_MESSAGES",
    {
        "GENERIC": "Ocorreu um erro.",
        "MAX_LINES": "Você já selecionou a quantidade máxima de linhas permitida.",
        "ALREADY_PRESENT": "Você já adicionou essa linha.",
        "NO_LINES": "Não possuimos informações sobre os pontos dessa linha.",
        "SERVICE_UNAVAILABLE": "O serviço de rastreamento de ônibus não está respondendo. Tente novamente mais tarde.",
        "LOCATION_UNAVAILABLE": "Não foi possível buscar sua localização. Certifique-se que seu serviço de localização está ativo."
    }
)
.constant("SUCCESS_MESSAGES",
    {
        "GENERIC": "Operação realizada com sucesso.",
        "BUS_NOTIFICATION": "Você será notificado quando o ônibus se aproximar.",
        "STOP_NOTIFICATION": "Você será notificado ao se aproximar do ponto.",
        "TOURIST_NOTIFICATION": "Você será notificado ao se aproximar do ponto."
    }
)
.constant("CONFIRMATION_MESSAGES",
    {
        "QUIT": "Deseja mesmo sair?",
    }
);

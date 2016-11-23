angular.module('trackbus')
.constant("ERROR_MESSAGES",
    {
        "GENERIC": "Ocorreu um erro.",
        "MAX_LINES": "Você já selecionou a quantidade máxima de linhas permitida.",
        "ALREADY_PRESENT": "Você já adicionou essa linha.",
        "NO_LINES": "Não possuimos informações sobre os pontos dessa linha.",
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

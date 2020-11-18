## Arquivos

Todos os triggers encontram-se dentro de uma função chamada setFormConfigs, em suas respectivas classes

inputsCard.js -> Refere-se aos cards das entradas
    linha 79: trigger da função que coloca o nome desse input no campo de criação de novas entradas
    linha 90: trigger da função que ativa o editMode, colocando o nome e a expressão do input nos campos de edição
    linha 96: trigger da função que deleta o input
        OBS.: Apesar de estar deletando o input do window.CurrentInputGroup, ainda não está deletando o nó no inputGraph e no inputGroup

inputsMenu.js -> Estrutura do menu
    linha 178: cria uma nova entrada -> this.editMode = false
    linha 182: edita uma entrada -> this.editMode = true
        OBS.: A edição de entrada ainda não funciona e existe um comentário onde o seu trigger deve ser puxado

rawInputsList.js -> Refere-se a seção de entradas cruas
    linha 78: trigger da função que coloca o nome desse input no campo de criação de novas entradas
    linha 89: trigger do aparecimento do campo de edição das entrdadas cruas
    linha 96: trigger da edição da entrada crua
        OBS.: A edição de entrada ainda não funciona e existe um comentário onde o seu trigger deve ser puxado
    linha 105: adiciona uma nova entrada crua
        OBS.: Revisar código do inputGroup, o qual pode estar gravemente errado
    linha 124: remove uma entrada crua
        OBS.: Busca topológica não ativada e possíveis problemas no inputGroup
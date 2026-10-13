# Recursos clássicos — conferência de 12/10/2026

O explorador integra busca geral, chaves, páginas de cidades e regiões, planejamento de quests, diário manual local, conjuntos de equipamentos, planejamento de comida e dossiês de livros/mistérios. As criaturas receberam orientações editoriais por vocação, sem atributos ou fraquezas modernas.

## Chaves

34 fichas selecionadas a partir dos guias clássicos e cruzadas com páginas individuais do item, registro histórico do Tibia.pl e catálogo por versão. As entradas não foram importadas em bloco do catálogo moderno. As datas de introdução aparecem apenas quando a página individual as documenta; data desconhecida não foi inventada.

- Usos: registro histórico e ficha individual, comparados à quest clássica.
- Elathriel / 3012: preço 5.000 gp corroborado no diálogo e na implementação de referência clássica.
- Dermot / 3940: preço 2.000 gp corroborado no diálogo e na implementação de referência clássica. Uma listagem antiga do Tibia.pl contém uma divergência; ela não foi usada para esse preço.
- 4501: localização exata retirada da nova ficha devido à divergência entre a posição descrita na página do item e a base cartográfica. Não há botão para tratá-la como SQM confirmado.
- 3702: não foi acrescentada à central, porque o uso original da chave e a época de sua perda de utilidade não foram confirmados.
- Botões de mapa mostram etapas relacionadas do guia. Não declaram o SQM de um recipiente como validado no jogo.

Fontes:
https://tibia.pl/itemslist/key
https://tibia-wiki.com/7.4/pt/Items/Keys
https://www.tibiawiki.com.br/wiki/Key_4503
https://www.tibiawiki.com.br/wiki/Key_3940
https://github.com/Ethaan/mintwall/blob/main/server/data/npc/scripts/dermot.lua
https://github.com/Ethaan/mintwall/blob/main/server/data/npc/scripts/elathriel.lua

## Comida

Duração, peso e agrupamento dos seis alimentos foram comparados à tabela de Food and Regeneration das Tibiantis Notes. Os tempos também coincidem com as páginas individuais do Wiki. Tibiantis é uma recriação com particularidades, portanto seus dados não são considerados prova automática de todas as regras do Tibia original. Neste recurso foram usados somente os valores coincidentes desses alimentos clássicos, sem suas tabelas modernas de ganho de HP/mana ou preços específicos do servidor.

| Comida | Tempo (s) | Peso (oz) | Agrupável no 7.4 |
|---|---:|---:|---|
| Meat | 180 | 13 | sim |
| Ham | 360 | 20 | sim |
| Fish | 144 | 5,2 | sim |
| Brown Mushroom | 264 | 0,2 | sim |
| Bread | 120 | 5 | sim |
| Cheese | 108 | 4 | não |

O limite clássico é 1.200 segundos de alimentação. O planejador calcula estoque para comer ao longo da sessão, não uma quantidade para ingerir de uma vez. O ganho de mana continua na calculadora já existente, com o perfil de regeneração selecionado.

https://tibiantis-notes.github.io/Food_and_regeneration
https://www.tibiawiki.com.br/wiki/Brown_Mushroom
https://www.tibiawiki.com.br/wiki/Cheese

## Integrações e limites

- Cidades agrupam os dados já presentes no catálogo. NPCs atribuídos por proximidade continuam identificados como região aproximada.
- O planejador mostra somente quests com versão documentada até 7.4. Nível de referência não significa segurança, nem elimina requisitos de equipe.
- Os sets são exemplos dos itens da base, sem preços de jogadores inventados ou recomendação automática de melhor conjunto.
- O diário é manual, salvo no navegador. Abrir um guia não marca sua conclusão. Backup JSON é exportado e restaurado localmente, sem envio ao servidor.
- Dossiês de livros são resumos próprios e apontam para fontes. Não reproduzem livros inteiros nem tratam uma teoria sobre Serpentine Tower como solução comprovada.
- A implementação de referência Mintwall auxilia a comparação, mas não constitui sozinha prova das regras originais. Divergências não foram resolvidas escolhendo silenciosamente um dos valores.

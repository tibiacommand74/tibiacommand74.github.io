# Revisão de itens e padrão visual da biblioteca — 17/10/2026

Catálogo: 679 → 677 itens. Auditoria estrutural de todos os registros, revisão dirigida de compatibilidade histórica e comparação dos atributos numéricos com duas reconstruções comunitárias. Este trabalho não certifica individualmente todos os objetos como obtíveis no servidor oficial de 2004.

- Small Stone (1294) recebeu ficha e links inversos do loot já registrado. Presença anterior ao 7.4 documentada; ataque 5 e peso 3,6 oz da reconstrução clássica, sem proficiências modernas.
- Worm retirado (introduzido no 7.5). Ceremonial Mask suspenso pela documentação de introdução no 7.8, apesar do registro no XML antigo.
- Dwarven Legs suspenso: fontes divergem sobre presença, disponibilidade e atributos. Não foi classificado definitivamente como item posterior; existência de sprite não comprova obtenção.
- Elven Legs permanece como registro histórico, com armadura oculta e exclusão dos cálculos. Não foi importada a armadura da versão atual.
- 232 itens recategorizados. Munição, chaves, valiosos, documentos, luzes, instrumentos, utensílios e objetos mágicos ganharam categorias próprias. Corpos deixam de aparecer como recipientes comuns. Ancient Rune não é apresentada como runa conjurável.
- 1.665 referências de estoque de NPCs normalizadas para IDs canônicos; oito ofertas residuais retiradas. Comércio validado em ambas as direções, preservando preço e NPC. Preços de compra ordenados do menor para o maior; venda do maior para o menor.
- Todas as 677 imagens foram decodificadas e seus arquivos verificados. Isso não equivale a comparação visual individual de todos os sprites.
- Loot original das criaturas preservado; vínculos inversos reconstruídos por ID. IDs sem ficha não foram ligados apenas por semelhança de nome.
- Duas bases divergem em 19 registros (incluindo pequenas diferenças de precisão e um nome). Valores principais não foram substituídos automaticamente. Divergências relevantes remanescentes aparecem nas fichas; dados modernos não são prova dos atributos de 2004.

O relatório JSON registra recategorizações, referências alteradas, imagens e divergências. Os cards de itens, NPCs e criaturas adotam a composição das magias, com arte, categoria, fatos comparáveis e ação. Diretórios estáticos usam os mesmos renderizadores do atlas. Magias preservam seus requisitos e filtros.

## Fontes e limites

- [XML principal fixado em commit](https://github.com/Ethaan/mintwall/blob/263b5b0b01b689861ebe3c13a605e6badd1ed3ee/server/data/items/items.xml)
- [Segunda reconstrução 7.4](https://github.com/Inconcessus/html5-tibia-engine/blob/master/tools/items-xml/740-items.xml)
- [Cliente clássico de referência](https://github.com/Inconcessus/html5-tibia-client)
- [Worm: introdução 7.5](https://www.tibiawiki.com.br/wiki/Worm)
- [Ceremonial Mask: introdução 7.8](https://www.tibiawiki.com.br/wiki/Ceremonial_Mask)
- [Dwarven Legs: registro 7.3 na wiki inglesa](https://tibia.fandom.com/wiki/Dwarven_Legs), em conflito com a [wiki brasileira](https://www.tibiawiki.com.br/wiki/Dwarven_Legs).
- [Elven Legs](https://www.tibiawiki.com.br/wiki/Elven_Legs): presença histórica e atributos atuais não devem ser confundidos.
- [Small Stone](https://www.tibiawiki.com.br/wiki/Small_Stone): presença anterior ao 7.4; mecânicas modernas não importadas.

Validação: suíte completa do Pages, teste novo de integridade de itens, renderização das 1.155 fichas e estrutura HTML dos diretórios. Prévia visual em navegador indisponível neste ambiente; não foi declarada validação visual.

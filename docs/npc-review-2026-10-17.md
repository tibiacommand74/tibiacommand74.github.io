# Revisão dos NPCs — 17/10/2026

303 → 308 fichas. Todos os NPCs receberam retratos estáticos reconstruídos do cliente 7.4; 225 aparências únicas são compartilhadas quando a referência usa o mesmo outfit e as mesmas cores. Foram preservados os modelos antigos, inclusive The Orc King como slime, os oráculos como objeto/estátua e NPCs com aparência de monstros. Nenhum addon posterior foi aplicado.

## Correções e apresentação

- 62 rótulos de cidade/região corrigidos ou tornados legíveis. Exemplos: Gamon, Loria, Topsy e Turvy deixam de aparecer em “Minocity”; comerciantes de Ab’Dendriel deixam de usar “HellsGate” como cidade; Markwin e A Prisoner ficam em Mintwallin. Os rótulos também foram sincronizados em itens, serviços e professores.
- 303 posições confrontadas com o arquivo de spawns fixado em commit, sem alterar suas coordenadas para a versão atual. Pontos indicam a referência do NPC, não localização ao vivo, caminho de acesso ou posição imóvel.
- Ebenizer (6.4), Eva (6.2), Muzir (6.97), Rokyn (7.1) e Suzy (6.0) incluídos como registros históricos. A presença anterior ao 7.4 tem documentação; o mapa consultado não fornece seus spawns. Por isso as fichas não inventam coordenadas nem oferecem botão de mapa. Recursos bancários modernos não foram importados.
- 43 vínculos de ensino inconsistentes suspensos: 14 em Shiriel, que misturavam venda de runa pronta com aprendizado, e 29 em Tothdral. No segundo caso, a função de professor é citada em fontes atuais, mas o XML clássico consultado não a confirma. A suspensão não prova que ele nunca ensinou no 7.4; exige confirmação histórica específica antes de republicar as ofertas.
- Seis ofertas de runas prontas removidas de Fenech e Shiriel, tanto do estoque do NPC quanto do item. A venda dessas runas foi anunciada pela CipSoft para versão posterior ao 7.4. Blank Rune permanece distinta da runa preenchida.
- Blank Rune a 10 gp vinculada a três vendedores clássicos omitidos: Frans, Rachel e Topsy, conforme a referência comunitária. Não foram importados indiscriminadamente os demais estoques do XML.
- Busca de NPC aceita também itens negociados, áreas, magias e grafias sem apóstrofo. Filtro de atividade inclui os registros de cambistas. Diretório público e atlas usam os mesmos cards e imagens.
- Fichas reorganizadas: retrato, cidade, indicadores de comércio/ensino, observação histórica, coordenadas quando registradas, estoque com miniaturas dos itens, magias e fontes de aparência.

## Fontes

- [Referência de NPCs, fixada em commit](https://github.com/Ethaan/mintwall/tree/263b5b0b01b689861ebe3c13a605e6badd1ed3ee/server/data/npc)
- [Spawns de referência](https://github.com/Ethaan/mintwall/blob/263b5b0b01b689861ebe3c13a605e6badd1ed3ee/server/data/world/Tibia74-spawns.xml)
- [Cliente 7.4, fixado em commit](https://github.com/Inconcessus/html5-tibia-client/tree/6d4b162255e7b89b08c2180ef35282f5700ef00e/data/74)
- [Composição de cores e máscaras do cliente](https://github.com/Inconcessus/html5-tibia-client/blob/6d4b162255e7b89b08c2180ef35282f5700ef00e/src/sprite-buffer.js)
- [Anúncio oficial de julho de 2005: venda de runas em lojas](https://www.tibia.com/news/?id=327&subtopic=newsarchive)
- [The Orc King e sua aparência antiga](https://www.tibiawiki.com.br/wiki/The_Orc_King)
- [Ebenizer](https://www.tibiawiki.com.br/wiki/Ebenizer), [Eva](https://www.tibiawiki.com.br/wiki/Eva), [Muzir](https://www.tibiawiki.com.br/wiki/Muzir), [Rokyn](https://tibia.fandom.com/wiki/Rokyn), [Suzy](https://www.tibiawiki.com.br/wiki/Suzy): presença histórica, não prova automática das posições atuais no 7.4.
- [Tothdral na documentação atual](https://www.tibiawiki.com.br/wiki/Tothdral): não usado como comprovação isolada do estoque ou ensino de 2004.

## Validação e limites

As imagens foram decodificadas, verificadas quanto a conteúdo/transparência e vistas nas quatro folhas de comparação. Os hashes dos arquivos DAT/SPR correspondem ao commit indicado. O relatório JSON contém atributos de aparência, arquivo de cada NPC, dimensões, hashes, posições, alterações de região e ofertas suspensas.

A comparação estrutural com o XML encontrou 717 diferenças de estoque/preço (649 ausências e 68 preços diferentes) antes das correções. Essas diferenças permanecem registradas para pesquisa; não são prova de que o catálogo deva copiar todo o XML. Há scripts e estoques modificados nessa reconstrução. A revisão não certifica individualmente todos os preços e diálogos como oficiais do servidor de 2004.

Validação automatizada: suíte do Pages com 25 testes, incluindo integridade dos 308 retratos/fichas, comércio e ensino em ambas as direções, 303 minimapas e cinco fichas sem marcador fabricado. A estrutura HTML foi verificada. A conferência visual do layout em navegador não estava disponível neste ambiente.

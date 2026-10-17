# Revisão das criaturas — 16/10/2026

## Escopo e resultado

Foram auditadas as 119 fichas existentes: atributos, ataques, defesas, imunidades, loot, referências inversas dos itens, busca e vínculos com respawns. Permanecem 106 fichas, incluindo 5 armadilhas indestrutíveis. Não foram importadas criaturas ou regras do Dura.

A fonte técnica foi fixada no commit `263b5b0b01b689861ebe3c13a605e6badd1ed3ee` de [Ethaan/mintwall](https://github.com/Ethaan/mintwall). Os 119 XMLs foram lidos e comparados. HP, XP, armadura e imunidades da importação original correspondiam aos XMLs; isso não comprova que os XMLs reproduzam o servidor oficial.

## Correções

- Retirados do catálogo clássico: Assassin, Bandit, Dark Monk, Smuggler, Demodras, Dharalion, General Murius, Grorlam, Necropharus, The Evil Eye, The Old Widow e The Horned Fox. As referências históricas os situam depois do 7.4. A página BR de Horned Fox descreve a variante 8.5, enquanto a referência Fandom registra 7.5; nenhuma sustenta presença no 7.4.
- Poisonthrower retirado enquanto sua identidade/presença histórica não for comprovada. Encontrado em bases OpenTibia, sem respawn na base usada. Não foi fundido automaticamente com Plaguethrower.
- Dark Cathedral permanece no catálogo de hunts com a exceção 7.5 já autorizada. A exceção da hunt não transforma suas criaturas em criaturas clássicas.
- Corrigida a leitura de 122 campos antigos `chance1` na auditoria da origem. O importador anterior os registrava como zero. Não são apresentadas porcentagens como taxas oficiais. Rolls repetidos do mesmo item são agrupados e seus máximos somados, incluindo conteúdo de containers; o máximo não é garantia de obtenção.
- Deathslicer, Flamethrower, Magicthrower, Plaguethrower e Shredderthrower classificados como armadilhas. Removidos HP técnicos, XP de abate e loot obtível. Os registros técnicos não devem ser tratados como inimigos derrotáveis.
- Ataques e habilidades apresentados separadamente: paralisia, dreno de mana/vida, cura, summons, transformação e invisibilidade. Detectar invisibilidade não significa ficar invisível. Conselho sobre posicionamento frontal usa ataques direcionais, não qualquer ataque de fogo.
- Sem botão de mapa quando não há respawns. Busca por nome completo de criatura no mapa usa correspondência exata (Dragon não inclui Dragon Lord); busca parcial continua disponível.
- Relações inversas de loot nos itens reconstruídas a partir do catálogo revisado. Fichas antigas retiradas recebem aviso e `noindex`, preservando URLs sem anunciar conteúdo posterior como 7.4.

## Divergências mantidas explícitas

A comparação de atributos e imunidades com [Tibia 7.4 / Tibiantis notes](https://tibiantis-notes.github.io/Creature) identificou divergências. Essa referência declara usar arquivos posteriores ao 7.4 e não foi usada como autoridade definitiva para substituições:

- Badger: 20 HP no XML, 23 na referência secundária e na wiki. HP ocultado com nota de revisão.
- Behemoth e Dwarf Geomancer: imunidade a dreno de vida divergente.
- Hunter, Skunk e Spider: imunidade a veneno divergente.

Os cinco campos de imunidade ficam desconhecidos (`null`), fora tanto do filtro “imune” quanto do filtro “sem imunidade”. Demais atributos continuam identificados como referência comunitária, sem afirmar certificação oficial.

## Fontes históricas consultadas

- [Assassin](https://www.tibiawiki.com.br/wiki/Assassin), [Bandit](https://www.tibiawiki.com.br/wiki/Bandit), [Dark Monk](https://www.tibiawiki.com.br/wiki/Dark_Monk), [Smuggler](https://www.tibiawiki.com.br/wiki/Smuggler).
- [Demodras](https://www.tibiawiki.com.br/wiki/Demodras), [Dharalion](https://www.tibiawiki.com.br/wiki/Dharalion), [General Murius](https://www.tibiawiki.com.br/wiki/General_Murius), [Grorlam](https://www.tibiawiki.com.br/wiki/Grorlam), [Necropharus](https://www.tibiawiki.com.br/wiki/Necropharus), [The Evil Eye](https://www.tibiawiki.com.br/wiki/The_Evil_Eye), [The Old Widow](https://tibiawiki.com.br/wiki/Old_Widow), [The Horned Fox](https://tibia.fandom.com/wiki/The_Horned_Fox).
- [Deathslicer](https://www.tibiawiki.com.br/wiki/Deathslicer), [Flamethrower](https://www.tibiawiki.com.br/wiki/Flamethrower), [Magicthrower](https://www.tibiawiki.com.br/wiki/Magicthrower), [Plaguethrower](https://www.tibiawiki.com.br/wiki/Plaguethrower), [Shredderthrower](https://www.tibiawiki.com.br/wiki/Shredderthrower).
- [Badger](https://www.tibiawiki.com.br/wiki/Badger), [Gazer](https://www.tibiawiki.com.br/wiki/Gazer).

As páginas atuais foram usadas para datas e divergências específicas. Resistências elementais modernas, bestiário, charms, loot moderno e regras de servidores customizados não foram importados.

## Validação

`test-creatures.cjs` percorre todas as 106 fichas, conferindo loot único, relações inversas, links de mapa somente com respawn, casos de invisibilidade/paralisia, armadilhas sem recompensa, filtros de dados desconhecidos e 13 avisos de retirada fora do sitemap. A suíte completa do workflow Pages passou localmente. Páginas individuais, diretórios e sitemap foram regenerados.

Limites: não houve validação visual em navegador nem combate/caminhada dentro do jogo. As taxas e posições da reconstrução comunitária não são certificadas como regras oficiais. Auditoria individual, hashes de origem, dados anteriores e alterações constam no JSON anexo no repositório.

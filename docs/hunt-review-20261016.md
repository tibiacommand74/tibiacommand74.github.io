# Revisão das hunts — 16/10/2026

Escopo: os 103 guias existentes em oito cidades/regiões. Não representa um catálogo de todos os locais do jogo, nem certificação oficial de coordenadas de 2004. Nenhuma hunt foi adicionada nesta revisão. Dark Cathedral permanece como exceção 7.5 solicitada pelo proprietário, sem mapa nem inclusão no buscador clássico.

## Correções

- Elvenbane: quatro guias eram silenciosamente excluídos do buscador por `Number('Pré-6.0')` produzir NaN. A classificação histórica agora trata esse valor e o contador usa o mesmo critério da busca. Teste de cobertura exige que cada um dos 102 guias clássicos seja alcançável.
- Risco: unificados “Médio” e “Moderado”. Antes, selecionar uma categoria ocultava os guias da outra apesar de representarem a mesma classe.
- White Flower Temple: removida a afirmação incorreta de imunidade física da Banshee. A base adotada registra imunidade a fogo, veneno e dreno de vida, mas não ao físico.
- Vampires de Ghostlands/Drefia: removida invisibilidade atribuída ao Vampire. A referência da criatura descreve transformação em morcego, paralisia e dreno de vida. Imunidade a invisibilidade não significa poder ficar invisível.
- Ghoul Hill: marcador existente está no andar +3, junto de um Demon Skeleton na base. O guia foi renomeado para setor superior, recebeu aviso de Hunters no acesso e mudou editorialmente de 20+/risco médio para 35+/risco alto. Coordenada mantida; não foi deslocada para outra sala por suposição.
- Deeper Fibula: esclarecidos Key 3940, obtenção da Key 3980, porta de nível 50, portal inicial de mão única e saída da caverna final. Quem já coletou a chave deve levá-la; não foi removido o aviso de bloqueio na porta interna. A orientação genérica de voltar pelo mesmo caminho foi substituída nos dois guias e em Hellgate/Draconia.
- Requisitos de porta separados da sugestão editorial: White Flower 25; Deeper Fibula e Black Knight 50. O filtro respeita ambos.
- Black Knight: corrigida a versão de introdução para 7.1, apoiada na quest documentada, e adicionada Key 5010 à lista de preparação.
- Preparação: Machete para Dragons de Venore, chaves de Carlin/Dwacatra, permissões de Isle of the Kings, Shovel para retorno de Edron Orc Lands.
- Tumbas Peninsula/Mountain/Oasis/Library: preparo contra Ghosts próximos ao marcador, sem inferir que pontos separados por paredes sejam uma única sala. Library passa a mencionar Scarab Coins para eventual avanço aos teleportes profundos.
- Carlin Rotworms: retirada fonte de Coryms de Kazordoon, descrição ajustada à pequena área nos canais.
- Mapas: retirados 23 segmentos inferidos em sete hunts. Os 125 marcadores permanecem. Segmentos antigos arquivados em `hunt-unverified-segments-20261016.json`; só devem voltar após evidência de caminho caminhável, portas e ligações.
- Proveniência e limites visíveis nas fontes dos guias: base comunitária, data de conferência dos marcadores e ausência de validação de caminhada no jogo.

## Fontes e critério

Foram consultados os guias geográficos das oito cidades, tumbas, ilhas, covis e acessos, além das fichas e arquivos abaixo. Páginas atuais contêm conteúdo posterior: suas listas modernas de equipamentos, loot, bosses, magias e ampliações não foram importadas. Presença de um lugar antigo não valida todas as características da página moderna.

- https://github.com/Ethaan/mintwall — origem da reconstrução comunitária utilizada no atlas.
- https://github.com/Ethaan/mintwall/blob/main/docs/reference-74/quests.md — pesquisa histórica e divergências, incluindo Deeper Fibula. A revisão antiga Fandom 55209 não abriu nesta sessão; sua leitura direta não é alegada.
- https://github.com/Ethaan/mintwall/blob/main/server/data/monster/banshee.xml
- https://github.com/Ethaan/mintwall/blob/main/server/data/monster/vampire.xml
- https://www.tibiawiki.com.br/wiki/Deeper_Fibula_Quest
- https://www.tibiawiki.com.br/wiki/Dragon_Lair_(Fibula)
- https://www.tibiawiki.com.br/wiki/White_Flower_Temple
- https://www.tibiawiki.com.br/wiki/Ghoul_Hill
- https://www.tibiawiki.com.br/wiki/Black_Knight_Quest
- https://www.tibiawiki.com.br/wiki/Hellgate
- https://www.tibiawiki.com.br/wiki/Draconia
- https://www.tibiawiki.com.br/wiki/Elvenbane
- https://www.tibiawiki.com.br/wiki/The_White_Raven_Monastery_Quest
- https://www.tibiawiki.com.br/wiki/Dwacatra
- https://www.tibiawiki.com.br/wiki/Ankrahmun_Pharaoh_Tombs_(Library)
- https://www.tibiawiki.com.br/wiki/Edron_Orc_Lands
- https://www.tibiawiki.com.br/wiki/Venore_Dragon_Lair
- https://www.tibia-wiki.net/wiki/Rotworms_Cave

Referências por guia, campos alterados, coordenadas e limites constam em `hunt-review-20261016.json`.

## Verificação

- 103 fichas renderizadas; 102 destinos abertos e alternados em teste de integração, incluindo andar, posição e URL.
- 125 marcadores principais/secundários correspondem à criatura no andar da base local. Amostragem dos PNGs confirmou pixels de terreno para todos; isso não prova acesso caminhável.
- Todos os 102 guias clássicos alcançáveis no buscador, com exclusão da exceção 7.5.
- Regressões de portas, tipos de risco, combate, retorno e procedência cobertas por testes.
- Busca automática, resultado vazio e ampliação de busca testados em DOM.
- Suite de publicação Pages executada, incluindo geração dos guias, links, catálogo, minimapas, rotas, autenticação e ferramentas existentes.
- Sem validação visual em navegador ou caminhada no jogo. Níveis/objetivos continuam editoriais; não foram inventadas medições de XP/h, lucro ou duração de respawn.

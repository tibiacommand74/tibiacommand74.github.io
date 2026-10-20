# Revisão visual — 20/10/2026

## Escopo e evidências

- Verificados 1.242 recursos de imagem únicos nos dados ativos: arquivos locais e imagens incorporadas decodificaram corretamente; nenhum recurso local ausente.
- Inspeção do site publicado: 12 rotas principais Mythera e 16 clássicas, além de Locais e Cidades; nenhum transbordamento horizontal na largura de desktop inspecionada. Imagens lazy fora da tela não foram classificadas como falhas de carregamento.
- Conferidos fontes e renderizadores de início, biblioteca, hunts, quests, mapa/locais, ferramentas, downloads, comunidade e Minha conta. Dados privados de membros não foram modificados.
- Todos os 41 scripts existentes de regressão passaram após gerar as páginas estáticas.
- Não houve emulação de aparelho móvel nesta execução. Os ajustes de CSS para telas estreitas foram conferidos no código, sem afirmar uma verificação visual em dispositivo físico.

## Correções

- Dez imagens oficiais leves em Mining, Crafting, Farming e Rituais, posicionadas junto às respectivas instruções. Cada figura tem legenda, origem, dimensões, carregamento adiado e link para ampliar. Animações longas são representadas por quadros estáticos; não há reprodução automática.
- Campos com textos longos ocupam a linha inteira nos cards compartilhados, evitando colunas estreitas e texto excessivamente quebrado.
- Busca, painéis de referência e hover da navegação Mythera seguem a paleta do servidor.
- NPCs e criaturas sem retrato documentado usam ícones neutros de categoria, com descrição acessível. Nenhuma aparência de outro personagem foi atribuída a eles.
- Cabeçalhos de fichas de hunts/quests passam a reutilizar a ilustração correta do registro ou o ícone da categoria.
- Padronizados limites de ilustrações, quebra de texto, rodapés, foco por teclado e espaçamentos em telas estreitas.
- Ajustado o singular de ofertas e do contador de resultados de NPC.
- Cabeçalho de páginas individuais: Minha conta deixa de ser um botão permanentemente desativado e abre a central de conta; o Instagram recebe o acabamento e área de toque do padrão aprovado.
- O gerador também inclui o CSS compartilhado nas páginas individuais e diretórios.

## Fontes das novas imagens

- https://mythera74.gitbook.io/mythera74/systems/mining
- https://mythera74.gitbook.io/mythera74/systems/crafting
- https://mythera74.gitbook.io/mythera74/systems/farming
- https://mythera74.gitbook.io/mythera74/systems/rituals-system

As imagens foram conferidas em conjunto e correspondem às cenas descritas. Não foram inventados sprites, localizações, recompensas ou novos dados de combate. A Strange Remainder e Farmer continuam sem retrato próprio confirmado; a ficha informa essa limitação.

As páginas HTML de catálogo e guias são regeneradas pelo workflow de publicação a partir das fontes. O commit conserva esse fluxo, sem adicionar saídas geradas redundantes.

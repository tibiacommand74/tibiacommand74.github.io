# Magias — organização e desenho de 17/10/2026

## Experiência

A aba Magias ganhou uma apresentação própria dentro da biblioteca existente, com resumo do catálogo, busca no topo e filtros próximos dos resultados. Foram adicionadas categorias Ataque, Cura e Suporte, indicação dos filtros aplicados, limpeza em um clique e ordenação por mana e preço. As 66 fichas ficam disponíveis sem depender de “Mostrar mais”. Valores de mana variáveis continuam identificados e são ordenados depois dos valores fixos.

Cards mostram imagem real de runa/conjuração ou símbolo vetorial por finalidade; nome e palavras mágicas; ML de lançamento/criação; custo de mana; ML de uso e cargas para runas; vocações; promoção quando necessária; acesso Free/Premium e preço para aprender. A composição usa a paleta verde/dourado do projeto, contraste de texto e espaçamento consistente. Imagens existentes foram preservadas; nenhum atributo, preço ou requisito da fonte foi alterado.

A ficha detalhada destaca as palavras e permite copiá-las, com mensagem de sucesso e alternativa manual quando o navegador não permite copiar. Os requisitos são separados em blocos legíveis. Professores ficam agrupados por cidade com links para ficha e mapa. Um filtro de vocação incompatível com uma magia aberta por outro caminho não esconde todos os professores. Ofertas por NPC continuam disponíveis.

O diretório `/magias/` usa os mesmos cards e mantém pesquisa por nome, palavras, finalidade, tipo e vocação. As 66 páginas individuais usam o mesmo desenho e a ação de copiar. Referências e links permanentes foram preservados.

## Responsividade e acessibilidade

Grids com `minmax(0,1fr)`, quebra de palavras, filtros em duas colunas em larguras menores, cards em uma coluna no celular e ações com área de toque de pelo menos 40–44px. Botões de finalidade usam `aria-pressed`, mensagens de cópia e contagem usam regiões de status e botões/inputs mantêm foco visível. Animações de cards respeitam redução de movimento.

## Validação

`test-spell-design.cjs` cobre as 66 fichas/cards, filtros combinados e limpeza, ordenação com mana variável, ML zero de uso de runa, promoção, filtros de professor incompatíveis e cópia com sucesso ou falha. Um parser HTML conferiu as 67 páginas (diretório e 66 fichas), sem IDs duplicados, imagens sem alt ou controles interativos aninhados. A suíte completa do workflow Pages foi executada. O hash de `catalog-data.js` foi preservado.

A prévia visual de navegador não estava disponível no ambiente; as verificações de estrutura, estilos responsivos e comportamento foram feitas por código. Não foi instalado um navegador nem gerada uma captura simulada.

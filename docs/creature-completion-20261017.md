# Complemento do catálogo — 17/10/2026

A revisão anterior conferiu as 119 fichas importadas, mas não comparou o catálogo publicado com todas as entradas da origem. A exibição inicial também ficava limitada a 32 cards. Este complemento corrige ambos os problemas sem declarar que uma contagem por si só comprova exaustividade histórica.

## Inclusões comprovadas

- **Orshabaal (7.4):** boss de invasão documentado na [wiki BR](https://www.tibiawiki.com.br/wiki/Orshabaal) e na [categoria histórica 7.4](https://tibia.fandom.com/wiki/Category:Creatures_Implemented_in_Version_7.4). O arquivo `orshabaal.xml` existe no commit já auditado de Ethaan/mintwall, mas havia sido omitido na importação. Vida de referência: 22.500 HP, coincidente nas referências consultadas. XP não exibido: XML registra 9.999 e wiki 10.000. Não importados loot/aparência do XML (contém rods e outro outfit), resistências modernas ou respawn fixo fictício. Ataques gerais, cura e invocação de Demons identificados na ficha; sem faixas numéricas de dano nem taxas.
- **Demon (Goblin) (7.4):** [variante disfarçada de Goblin](https://www.tibiawiki.com.br/wiki/Demon_(Goblin)), 50 HP e 25 XP, correspondente a `demongoblin.xml`. Nove marcadores existentes foram renomeados de `Demongoblin` para o nome da ficha, sem mover coordenadas. Busca aceita os aliases Demongoblin, Demon Goblin e Goblin Demon. Loot omitido devido a divergência do XML com a wiki. Não copiado o loot de Goblin nem de Demon.
- **Mimic (7.3):** presença documentada na [wiki BR](https://www.tibiawiki.com.br/wiki/Mimic) e na [categoria 7.3](https://tibia.fandom.com/wiki/Category:Creatures_Implemented_in_Version_7.3). Ficha identificada como registro histórico, sem estatísticas ou locais atuais atribuídos ao 7.4. Não inventados pontos no mapa.

As listas históricas 7.3 e 7.4 revelaram essas lacunas. As categorias 7.1, 7.2, 6.4 e 6.61–6.97 também foram consultadas. As listas consultadas são fontes comunitárias e não um inventário oficial certificado. `Slime Summon`, variante de implementação com o mesmo nome visual, não foi contado como espécie nova.

**Ferumbras:** foi acrescentada uma explicação na tela: o personagem controlado pela CipSoft precede o boss automático do 7.8. Não foram adicionados atributos, loot ou localização posterior como ficha 7.4. Fontes: [Ferumbras/Fandom](https://tibia.fandom.com/wiki/Ferumbras), [wiki BR](https://www.tibiawiki.com.br/wiki/Ferumbras). Há divergência nas datas das fichas por tratarem essas duas formas de maneira diferente.

## Exibição e validação

O catálogo passa a 109 fichas (criaturas, bosses, cinco armadilhas e um registro histórico). Todas são renderizadas na entrada da aba, sem depender de “Mostrar mais”. Busca, imunidades e ordenação continuam disponíveis. Campos desconhecidos não são convertidos em zero.

Teste percorre as 109 fichas, garante que as 109 aparecem sem filtros, valida os aliases, os nove marcadores e a ausência de espécies sem ficha no mapa. Páginas individuais e sitemap regenerados. As 13 retiradas anteriores permanecem; não houve reinclusão de criaturas posteriores para aumentar a contagem.

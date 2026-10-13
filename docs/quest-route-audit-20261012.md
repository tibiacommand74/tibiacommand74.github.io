# Auditoria dos guias e mapas — 12/10/2026

Escopo: 98 registros, 689 etapas antes da correção e 687 depois. A existência histórica de todas as entradas continua separada das verificações cartográficas.

## Correções

- Folda: a Pick desce automaticamente do z=8 ao z=10. Duas etapas que inventavam um percurso no z=8 até outra escada foram removidas. A instrução usa Destroy Field antes da Pick e a referência própria da Dark Helmet.
- A imagem do TibiaWiki da rota após a descida foi alinhada à geometria do atlas. A linha do z=10 continua sendo uma referência; não houve validação no jogo.
- 31 linhas atravessavam regiões de parede nos PNGs do atlas. 17 foram reajustadas sobre terreno representado, 13 foram suspensas e a restante era o desvio removido de Folda. Reajuste cartográfico não comprova que portas ou mecanismos estão abertos.
- Trechos suspensos mantêm somente o alvo cartográfico e um aviso, sem sugerir caminhada pela parede.
- Painel e minimapas usam a mesma convenção: z=8 = subsolo -1.
- Mudanças distantes de andar e retornos não são apresentados como escadas locais. Contagens de linhas e ligações pendentes são recalculadas.
- Ancient Tombs: cada marcador identifica a entrada na superfície. Falas e mecanismos descritos pertencem às câmaras internas.
- Fibula: o marcador da Key 3980 identifica o buraco, não o recipiente no andar de baixo.
- Preparação: chaves adquiridas durante a quest são identificadas, e requisitos duplicados foram removidos.
- Data editorial ajustada à data local do Brasil.

## Evidências e limites

- Os 74 marcadores com falas de NPCs foram comparados à base clássica publicada; nenhuma divergência de coordenadas foi encontrada. Isso não valida posições em servidores modificados.
- 74 referências principais únicas foram consultadas; 72 responderam HTTP 200. As duas referências do Fandom não puderam ser verificadas neste ambiente. As entradas respectivas continuam como referências históricas pendentes.
- As 8.807 amostras das linhas restantes nos PNGs publicados não cruzam fundo nem a cor de parede. O teste acompanha os mapas reais do repositório e evita reintroduzir o problema.
- Cor de minimapa não comprova transitabilidade: portas, fields, paredes que se movem, teleports e escadas precisam de evidência específica ou validação no jogo. Nenhuma linha foi promovida a percurso validado.
- O TibiaWiki atual reúne algumas quests antigas em missões mais recentes. Requisitos de missões modernas não foram acrescentados automaticamente ao catálogo 7.4.

Fontes do caso de Folda:
https://www.tibiawiki.com.br/wiki/Dark_Helmet_Quest
https://www.tibiawiki.com.br/wiki/Alawar%27s_Vault_Quest

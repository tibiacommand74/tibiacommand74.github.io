# Minha conta — revisão de 18/10/2026

## Lacunas encontradas e correções

O diário oferecia anotações nas fichas do catálogo, mas não um caderno livre sobre o personagem. Não havia histórico manual de level, XP, magic level e skills nem ficha privada independente do perfil público. Adicionada a área Meu personagem com três abas: ficha, anotações livres e histórico de evolução. A visão geral ganhou atalhos e resumo do personagem, sem misturar dados privados com o perfil da comunidade.

A ficha guarda vocação, objetivo de level e descrição privada. As anotações têm categorias, busca, fixação, edição e arquivamento recuperável. A evolução tem data, level, XP total opcional, magic level e sete skills, observações, edição e arquivamento. Valores desconhecidos ficam vazios, sem virar zero. O resumo informa a data de cada último valor conhecido. A comparação usa primeiro e último registros ativos e permite variações negativas. Não estima XP/h nem consulta o personagem no jogo.

A seleção permite reutilizar personagens com registros na conta ou informar outro personagem e servidor. Seus registros usam o diário privado já existente, com chaves independentes para cada anotação e atualização. Não foi criada uma nova tabela nem alterada a autenticação.

O carregamento do diário tinha limite de mil registros; agora é paginado e ordenado. As gravações são divididas em lotes. A gravação local passou a atualizar a memória somente depois de o navegador confirmar o armazenamento. Falhas de sincronização não são apresentadas como gravação na nuvem. Backups do diário incluem os novos registros e sua restauração valida formato, campos, identificadores e o personagem/servidor indicado nos novos backups.

## Validação

27 suítes de teste e a geração de páginas. Testes novos exercitam submissão de formulários, leitura posterior, datas, XP coerente com level, snapshots parciais, edição antiga, arquivamento, sanitização, backup, falha de armazenamento, uso offline e isolamento por conta/personagem/servidor. Acesso ao banco confirmado por consulta ao catálogo: RLS habilitado, anon sem SELECT, políticas de SELECT/INSERT/UPDATE vinculadas a auth.uid() e verificação de proprietário também no UPDATE. Os novos registros respeitam o limite JSONB de 10.000 bytes. Nenhum dado de personagem real foi alterado para testar.

A verificação autenticada de ponta a ponta e a inspeção visual no navegador não foram realizadas neste ambiente. A conferência pública verifica os arquivos entregues. Escritas concorrentes do mesmo registro em aparelhos diferentes continuam usando a política existente do diário: a última gravação sincronizada prevalece. Registros de evolução separados reduzem conflitos entre lançamentos independentes.

O advisor do projeto também apontou uma configuração preexistente de proteção contra senhas vazadas desativada. Esta revisão não alterou configurações de autenticação: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection.

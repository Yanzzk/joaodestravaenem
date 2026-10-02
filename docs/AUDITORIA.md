# Relatório tático — 02/10/2026

1. Resumo da limpeza

Na LP pública havia Meta Pixel, UTMify e envio de navegação/referrer a uma função Supabase. No quiz original também havia TikTok. Nenhum deles faz parte do código entregue. Retirados HTML de rastreio, pixel noscript, dependências remotas de execução, links comerciais originais e referências de domínio/proprietário no código. Player remoto substituído por implementação própria. MP3 e mídia localizados. Não foram identificados FOMO de compra, bloqueio deliberado de inspeção ou bloqueio por hostname no código de aplicação examinado.

O bundle React contém nomes de eventos normais que não são, por si sós, espionagem. A reconstrução estática não inclui o bundle, evitando também termos como “contextmenu” da biblioteca. Não foram incluídos arquivos originais de rastreamento para referência dentro deste pacote.

A política de conteúdo restringe scripts, imagens e fontes à própria hospedagem, bloqueia conexões de script e submissões de formulário, e permite a mídia opcional do Cloudinary apenas no quiz. Referrer não é enviado. Nenhuma CAPI foi copiada; o servidor original não foi acessado nem auditado.

2. Links alterados

Um link de checkout original da LP foi substituído por `[SEU_LINK_AQUI]`. Dois links legais que já estavam sem destino também receberam campos próprios com esse placeholder. Dois atalhos internos para a seção de preço foram preservados. A tela 9 ganhou um link local para `lp.html`. Sem checkout válido, nenhuma compra é iniciada.

3. Resultado da auditoria Ctrl+F

Varredura literal, sem distinguir maiúsculas/minúsculas, em nove arquivos HTML/JS/CSS: zero ocorrências de todos os termos solicitados na Fase 7. Zero scripts remotos. Zero caminhos locais de assets faltantes. Zero formulários. Também foram verificadas referências aos domínios do proprietário, player anterior e serviços de rastreio encontrados: zero no código entregue.

Essa conclusão se aplica aos arquivos executáveis locais desta V2. Este relatório menciona nomes para documentar a limpeza, e não é código executável. Não abrange o Windows do usuário, infraestrutura de hospedagem futura, servidor de checkout ou conteúdo falado/visual da VSL. Não constitui promessa de ausência absoluta de vulnerabilidades.

4. Código-fonte limpo

- `index.html`: entrada do quiz.
- `config.js` e `app.js`: configuração e lógica do quiz/player.
- `styles.css`: apresentação do quiz/player.
- `lp.html`: HTML completo e estático da LP.
- `lp-config.js` e `lp.js`: configuração e controles mínimos da LP.
- `lp.css` e `lp-base.css`: CSS local da LP.

Os arquivos não são ofuscados e podem ser editados diretamente. Nenhum processo de instalação ou build é exigido para abrir o pacote entregue.

## Evidência de origem e calendário

Referências técnicas recuperadas da LP e do quiz públicos indicados pelo usuário. A cópia local do Windows não foi recebida.

Calendário verificado: https://www.gov.br/inep/pt-br/centrais-de-conteudo/noticias/enem/enem-2026-resultado-dos-recursos-de-atendimento-especializado-esta-disponivel — primeiro dia em 08/11/2026, início 13h30 de Brasília.

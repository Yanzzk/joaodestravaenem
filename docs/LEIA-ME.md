# Funil Redação em Ação — V2

Abra `index.html` depois de extrair a pasta completa. O fluxo contém nove telas de quiz/apresentação e uma LP em `lp.html`, acessível pelo botão da tela 9. Nenhum pagamento está ativo. A LP foi recuperada a partir da versão pública, não da pasta do Windows.

## O que está entregue

- MP3 original de tic-tac, local em `assets/tic-tac-original.mp3`. Toca na contagem, permite silenciar e para ao avançar. Se o navegador bloquear o início, aparece o botão para ativar. O limite de oito segundos e o clique para continuar foram mantidos.
- VSL fornecida, recomprimida em `assets/vsl-otimizada.mp4`: 13.420.936 → 8.750.490 bytes, redução de 34,8%, 142,016 segundos, 404×720, H.264/AAC, metadados de início antecipado. Arquivo local pronto; não foi feito upload à sua conta Cloudinary.
- Player próprio azul: iniciar, pausar, continuar, mutar, volume, barra real de progresso, tela cheia quando suportada, reiniciar, erro/repetição e retomada neste aparelho. Sem logotipo ou alegação de vínculo com plataforma externa. A preferência de progresso fica apenas no armazenamento local do navegador, sem envio.
- Áudio e vídeo não dependem dos domínios do anunciante. A fonte do vídeo é carregada apenas na tela final, com pré-carregamento de metadados, não em todas as etapas.
- Contagem corrigida para 08/11/2026, 13h30 de Brasília, primeiro dia de provas informado pelo Inep. A data é absoluta; não reinicia para cada visitante.
- LP estática, CSS compilado e fontes locais. FAQ com quatro respostas e dois atalhos internos para preço.
- Mockup independente com nome provisório “Redação em Ação”. O nome pode ser alterado; sua disponibilidade comercial não foi verificada.

## Onde editar

`config.js`: perguntas, textos, MP3, volume, data e vídeo.

`lp-config.js`: link HTTPS do seu checkout, termos e privacidade. Os três campos estão como `[SEU_LINK_AQUI]`. O botão de compra não navega para endereço fictício e informa indisponibilidade enquanto não for configurado.

`lp.html`: conteúdo, preço, garantia e composição da oferta. O preço R$39,90 foi mantido como referência provisória, não como preço validado.

`styles.css`: quiz e player. `lp.css`/`lp-base.css`: LP. Para ajustes comuns, edite `lp-base.css`; o visitante não precisa carregar compiladores, bibliotecas ou fontes de terceiros.

## Cloudinary

O link que você enviou foi a fonte da VSL. O pacote usa uma cópia otimizada local para funcionar sem nova ação sua. Se quiser usar Cloudinary na publicação, envie `assets/vsl-otimizada.mp4` para a sua conta e cole a NOVA URL HTTPS em `config.js`, no campo `videoUrl`. Usar a URL antiga continua servindo o arquivo pesado anterior. O HTML já permite mídia desse domínio; não permite scripts externos.

## Diferenças de conteúdo necessárias

Foram retirados: prova atribuída a três mil alunos, depoimentos do expert original, prazo de desconto renovado diariamente, referência visual ao perfil anterior, comunidade diária ainda inexistente e algumas promessas categóricas de resultado. Estrutura de seções, classes, cores e animações da LP foram preservadas; textos foram adaptados. Há ajuste de título/preço em celulares estreitos. Não se afirma identidade pixel a pixel.

A VSL fornecida não teve falas, rosto, identidade ou oferta reeditados: foi apenas recomprimida. Antes de publicar, alinhe o que é dito no vídeo ao seu produto e use material próprio ou autorizado. Limpeza de scripts não concede direitos de uso nem faz as promessas do vídeo corresponderem automaticamente à nova LP.

## Pendências antes de vender

1. Produzir e revisar o produto prometido. O e-book final não faz parte deste pacote; a arquitetura está em `PLANO-MVP.md`.
2. Confirmar nome, preço, bônus, prazo/forma de entrega e atendimento. Retirar qualquer item que não será entregue.
3. Configurar checkout, entrega dos PDFs e documentos legais próprios. A garantia e o prazo apresentados devem corresponder à operação real.
4. Alinhar VSL e LP. Conferir em celular real, com som e em conexão móvel, e testar pagamento/entrega com o modo de teste de sua plataforma.
5. Se quiser diagnosticar especificamente a cópia de `C:\Users\ggdea\Downloads\lprdp.joaomergulhao.com.br`, envie a pasta inteira em ZIP. O ambiente desta conversa não tem acesso a esse disco.

## Escopo dos testes

Verificação de sintaxe e testes com DOM simulado: nove telas, respostas, temporizadores, início/silenciamento/parada do áudio, estados do player, pausa, som, progresso, retomada, reinício, erro, finalização, botão para LP, quatro FAQ, âncoras e bloqueio do checkout não configurado. Mídia decodificada e arquivo de vídeo verificado integralmente por ferramenta de vídeo. Comparação SSIM média 0,9848, sem redimensionar. Essa medida não substitui avaliação visual humana.

Não houve teste renderizado em navegador real neste ambiente, nem teste em iOS/Android, velocidade móvel ou pagamento real. A reprodução no navegador ainda requer validação. Não há garantia de “zero bugs”. Arquivos estão prontos para inspeção e teste local.

## Publicação

Suba os arquivos HTML, CSS, JS e a pasta `assets/` para hospedagem estática HTTPS. Mantenha a árvore de pastas. Os arquivos `.md` são apenas documentação e não precisam ser publicados. Nenhuma publicação foi feita por esta conversa.

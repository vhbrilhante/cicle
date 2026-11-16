# cicle

Protótipo de alta fidelidade do **Cicle**: triagem de resíduos com confirmação humana.
A câmera do tablet identifica o resíduo na esteira, o triador confirma ou corrige com poucos toques, e o gestor transforma esse dado em valor (estoque, venda e crédito de reciclagem).

Projeto da disciplina na Afya São Lucas, equipe Cicle.

**Ver o protótipo: [vhbrilhante.github.io/cicle](https://vhbrilhante.github.io/cicle/)**

## Como abrir

Não há instalação nem build. Acesse o link acima ou abra `index.html` no navegador. Cada push na `main` publica de novo no GitHub Pages.

As fontes (Inter Tight, Atkinson Hyperlegible e Archivo) vêm do Google Fonts. Sem internet, o protótipo funciona com as fontes do sistema.

## O que tem

A tela de apresentação mostra o dispositivo no centro, as seções à esquerda e, à direita, a decisão de design de cada tela com o que testar.

**Triador · tablet 1280 × 800, paisagem**

| Seção | O que acontece |
| --- | --- |
| T1 · Entrar com crachá | Leitura do QR, "Olá", carregamento do perfil e entrada. |
| T1b · Entrar com PIN | Teclado numérico grande. PINs de teste: 0417, 0522, 0631. |
| T2 · Conferir item | O item entra na esteira, a detecção trava nele e o painel pergunta "Está certo?". |
| T3 · Corrigir | NÃO, material certo, confirmar. A foto congela e a esteira continua. |
| T4 · Perigo | Painel vermelho, sirene e alerta enviado ao gestor. |
| T5 · Não identificado | "Eu sei" ou "Não sei". Não saber é resposta válida. |
| T6 · Fim de turno e BU | Resumo, bônus e impressão do boletim. |

**Gestor · desktop 1440 × 900**

| Seção | O que acontece |
| --- | --- |
| G1 · Visão geral | Skeleton na primeira abertura, números contando, gráfico crescendo, alertas ao vivo vindos do tablet e rotas andando. |
| G2 · Estoque e vendas | Filtros, escolha de oferta, confirmação de venda com carregamento e estado vazio (vidro sem comprador). |
| G3 · Equipe e acessibilidade | Perfil de acessibilidade de cada triador, salvo no crachá. |

## Acessibilidade

O tablet é compartilhado, então as preferências ficam no **crachá**. O gestor configura uma vez (G3) e o tablet se ajusta quando a pessoa entra. O triador também pode mudar pelo botão de acessibilidade na barra.

- **Ler em voz alta**: fala o material e o risco de cada item (Web Speech, pt-BR). O botão "Ouvir" funciona sempre.
- **Sons de aviso**: som curto ao registrar e sirene em perigo (Web Audio).
- **Alto contraste**: segundo tema de cores, com laranja mais escuro para texto branco.
- **Letra maior**: todo o texto do tablet 15% maior.
- **Painel do lado esquerdo**: espelha a tela para quem trabalha com a mão esquerda.
- **Tempo para responder**: 5, 8 ou 12 segundos antes de o item virar "não conferido".
- **Menos animação**: corta os movimentos. Também respeita `prefers-reduced-motion`. A barra de tempo continua andando, porque é informação.
- **Entrar sem crachá**: PIN de 4 dígitos.
- Teclado: `S` sim, `N` não, `P` perigo, `Z` desfazer, `O` ouvir, `1–9` escolhem o material, `Esc` fecha. Foco visível em todos os controles.
- Leitor de tela: toasts e perigo são anunciados (`aria-live` e `role="alert"`); switches, rádios e diálogos têm papéis ARIA.
- Ícone e palavra sempre juntos; cor nunca carrega a informação sozinha.

## Microinterações

- Esteira em movimento; o item entra, a caixa de detecção "trava" e o painel sai do estado "Identificando…".
- Botões com escala ao toque e ondulação; contadores que pulam ao registrar.
- Barra de tempo de resposta, toasts com ícone, flash de captura.
- Seleção de material com mola e selo de confirmação; o alerta de risco troca junto.
- Painel de perigo com pulso na câmera e ícone que treme.
- Crachá lido com check desenhado; PIN com erro que balança.
- Sem rede: contador de "guardados no tablet" e envio com barra de progresso ao voltar.
- BU saindo da impressora linha a linha.
- Carregamentos pelo tempo de espera: nada até 100 ms, confirmação até 1 s, skeleton ou rodinha com palavra até 10 s, aviso de servidor acima disso.

Os carregamentos são feitos em CSS, sem biblioteca.

## Design system

Os tokens vêm do design system do Kite (base shadcn/ui, zinc): preto e branco na estrutura, verde `#15803D` para confirmar, vermelho da marca `#ED1C24`, e verde, laranja e vermelho só para grupos de risco. Raios 0 (badges, tabelas, controles do desktop), 16 e 20 (botões do tablet, alertas e cards). Ícones Phosphor no peso regular, embutidos em `js/icons.js`.

Botões seguem um sistema só (`.btn` + variante + tamanho):

- Variantes: `btn-primary`, `btn-outline`, `btn-strong`, `btn-danger`, `btn-ink`, `btn-ghost`.
- Tamanhos do tablet: `btn-xl` (128 px), `btn-lg` (80), `btn-md` (64), `btn-sm` (52).
- Tamanho do desktop: `btn-d` (36, reto).

## Estrutura

```
index.html      shell de apresentação
css/app.css     tokens, componentes e telas
js/icons.js     ícones Phosphor (regular, MIT) e logo
js/app.js       estado, telas, microinterações e acessibilidade
```

Todos os números são fictícios.

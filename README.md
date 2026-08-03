# Radiadores Brasnal — site institucional

Site institucional da **Radiadores Brasnal Ltda**, oficina especializada em reforma e manutenção de radiadores em Taboão da Serra/SP, em atividade desde 17 de setembro de 1982.

Site estático puro: **HTML + CSS + JavaScript**, sem build, sem framework, sem dependência de servidor. Sobe em qualquer hospedagem — basta jogar os arquivos na pasta pública.

---

## 1. Como colocar no ar

### Opção A — GitHub Pages (já configurado)

O repositório já está pronto para o GitHub Pages. Em `Settings → Pages`, deixe:

- **Source:** Deploy from a branch
- **Branch:** `main` · pasta `/ (root)`

Cada `git push` republica o site automaticamente.

### Opção B — Hospedagem tradicional (Hostinger, Locaweb, cPanel, KingHost…)

1. Baixe o repositório como ZIP (`Code → Download ZIP`) e descompacte.
2. Envie **todo o conteúdo da pasta** para o diretório público do servidor — normalmente `public_html/`, `www/` ou `htdocs/`.
3. Confirme que o `index.html` ficou na **raiz** desse diretório, não dentro de uma subpasta.
4. Ative o SSL/HTTPS no painel da hospedagem.

Não há banco de dados, PHP, Node ou variável de ambiente para configurar.

### Opção C — Netlify / Vercel / Cloudflare Pages

Conecte o repositório e publique. Configuração de build:

- **Build command:** *(deixe vazio)*
- **Output / publish directory:** `.` (raiz)

---

## 2. Apontar o domínio

Depois de comprar o domínio (sugestão: `radiadoresbrasnal.com.br`):

**No GitHub Pages**

1. Crie na raiz do repositório um arquivo chamado `CNAME` contendo apenas a linha:
   ```
   radiadoresbrasnal.com.br
   ```
2. No painel do registrador (Registro.br, GoDaddy…), crie os registros:

   | Tipo  | Nome  | Valor |
   |-------|-------|-------|
   | A     | `@`   | `185.199.108.153` |
   | A     | `@`   | `185.199.109.153` |
   | A     | `@`   | `185.199.110.153` |
   | A     | `@`   | `185.199.111.153` |
   | CNAME | `www` | `<usuario>.github.io` |

3. Em `Settings → Pages → Custom domain`, informe o domínio e marque **Enforce HTTPS**.

**Em hospedagem tradicional:** aponte os nameservers do domínio para os da hospedagem — o painel cuida do resto.

### Depois de apontar o domínio: trocar as URLs

Enquanto o site roda no GitHub Pages, as URLs públicas embutidas nele apontam para
`https://sussamgtads.github.io/radiadores-brasnal/`. Ao migrar para o domínio próprio,
substitua essa URL pela nova em três arquivos — é uma busca-e-substitui simples:

- `index.html` — canonical, Open Graph, Twitter Card e dados estruturados
- `sitemap.xml`
- `robots.txt`

De uma vez pelo terminal:

```bash
grep -rl "sussamgtads.github.io/radiadores-brasnal" . | xargs sed -i '' "s|https://sussamgtads.github.io/radiadores-brasnal/|https://radiadoresbrasnal.com.br/|g"
```

Isso importa para o Google entender qual é o endereço oficial do site.

---

## 3. O arquivo que você vai querer editar

Praticamente toda a manutenção do site acontece em **um único arquivo**:

```
assets/js/config.js
```

Lá ficam telefone, e-mail, horário de funcionamento e — o mais importante — o número de WhatsApp.

### Ativar o WhatsApp

O site foi construído para funcionar bem **com ou sem** WhatsApp configurado:

- **Sem número** (estado atual): todos os botões de WhatsApp direcionam para ligação telefônica, e o formulário envia o orçamento por e-mail. Nada quebra.
- **Com número**: os mesmos botões passam a abrir o WhatsApp com a mensagem já escrita, e o formulário monta o pedido completo na conversa.

Para ativar, edite **uma linha**:

```js
whatsapp: '5511987654321',   // DDI + DDD + número, só dígitos
```

Salve, suba o arquivo, e o site inteiro se adapta sozinho.

---

## 4. Estrutura dos arquivos

```
.
├── index.html              Página única — todo o conteúdo do site
├── 404.html                Página de erro
├── assets/
│   ├── css/style.css       Estilos (design system em variáveis CSS no topo)
│   ├── js/config.js        ← CONFIGURAÇÃO (telefone, WhatsApp, horários)
│   ├── js/main.js          Comportamento (menu, formulário, animações)
│   └── img/
│       ├── favicon.svg     Ícone da aba do navegador
│       └── og-brasnal.png  Imagem exibida ao compartilhar o link
├── robots.txt              Liberação para buscadores
├── sitemap.xml             Mapa do site para o Google
├── site.webmanifest        Metadados de app / instalação
├── .nojekyll               Necessário para o GitHub Pages servir tudo
└── dev-server.js           Servidor local de desenvolvimento (opcional)
```

---

## 5. Rodar localmente

```bash
node dev-server.js
```

Abra `http://localhost:4173`. O `dev-server.js` serve apenas para testar na sua máquina — pode ser apagado sem afetar o site publicado.

---

## 6. O que já vem pronto

**SEO e presença no Google**

- Dados estruturados `AutoRepair` + `LocalBusiness` (endereço, telefone, CNPJ, horários, área atendida, catálogo de serviços) — é o que alimenta o painel lateral do Google.
- `FAQPage` marcado: as perguntas frequentes podem aparecer direto nos resultados de busca.
- Título, descrição, canonical, Open Graph e Twitter Card configurados.
- Meta tags de geolocalização para busca local.
- `sitemap.xml` e `robots.txt`.

**Conversão**

- Telefone clicável em quatro pontos da página.
- Formulário de orçamento com validação, que envia por WhatsApp ou e-mail.
- Botão flutuante de contato que aparece durante a rolagem.
- Selo dinâmico de "aberto agora / fechado" calculado pelo horário real.
- Seção "sinais de alerta" — captura quem está pesquisando o sintoma, não o serviço.

**Técnico**

- Responsivo de 320px a 4K, sem rolagem horizontal.
- Acessibilidade: navegação por teclado, foco visível, `skip link`, marcação semântica, `aria` no menu.
- Respeita `prefers-reduced-motion`.
- Sem rastreadores, sem cookies, sem coleta de dados.
- Carrega rápido: uma folha de estilo, dois scripts pequenos, ilustrações em SVG/CSS.

---

## 7. Trocar por fotos reais

O radiador do topo e os ícones são desenhados em SVG/CSS — funcionam bem e nunca quebram. Quando houver fotos da oficina, dos serviços e da equipe, os melhores lugares para inseri-las são:

1. **Topo (hero)** — substituir o bloco `.hero__art` por uma foto da fachada ou da bancada em serviço.
2. **A empresa** — uma foto do Sr. Ricardo trabalhando vale mais que qualquer texto.
3. **Nova galeria "antes e depois"** — o argumento de venda mais forte de uma oficina de radiador.

Use imagens em `.webp`, com no máximo ~1600px de largura, e sempre com `alt` descritivo.

---

## 8. Dados da empresa usados no site

| Campo | Valor |
|---|---|
| Razão social | Radiadores Brasnal Ltda |
| CNPJ | 51.335.206/0001-03 |
| Fundação | 17/09/1982 |
| Endereço | Av. Felício Baruti, 120 — Cidade Intercap, Taboão da Serra/SP, CEP 06757-000 |
| Telefone | (11) 4701-3185 |
| E-mail | radiadoresbrasnal@hotmail.com |
| Instagram | [@radiadoresbrasnal](https://www.instagram.com/radiadoresbrasnal/) |
| Atividade | Serviços de manutenção e reparação mecânica de veículos automotores |

Os horários publicados (seg–sex 08h–18h, sábado com agendamento) foram montados a partir das informações públicas disponíveis. **Confirme com a oficina antes de divulgar** e ajuste em `assets/js/config.js` se necessário — o selo de "aberto agora" e os dados estruturados do Google usam essa mesma fonte.

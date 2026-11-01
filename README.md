# Joyle Deep Tech: Website Institucional

Portal institucional e vitrine tecnológica da Joyle Deep Tech, empresa especializada em pesquisa científica aplicada e desenvolvimento de polímeros avançados para a indústria.

[![Stack: Vanilla HTML5/CSS3/JS](https://img.shields.io/badge/Stack-Vanilla%20Web-orange.svg)](https://developer.mozilla.org/)
[![Design: Dark Deep Tech](https://img.shields.io/badge/Design-High--Contrast%20Dark-darkgreen.svg)](https://github.com/VituColombo0/Joyle)
[![Web Server: Apache / Nginx](https://img.shields.io/badge/Server-Apache%20%2F%20Static-red.svg)](.htaccess)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Sobre a Joyle Deep Tech

A **Joyle Deep Tech** opera na intersecção entre a ciência de materiais fundamental e sua aplicação industrial escalável. Focada no design molecular de novos compostos poliméricos, a empresa transforma pesquisas laboratoriais em soluções de engenharia voltadas à sustentabilidade, resistência mecânica extrema e condutividade customizada.

### Linhas de Pesquisa e Atuação
- **Engenharia Molecular de Polímeros:** Síntese e funcionalização de cadeias macromoleculares sob medida.
- **Desenvolvimento de Materiais Compósitos:** Novos compósitos para aplicações automotivas, aeroespaciais e biomédicas.
- **Consultoria Científica Especializada:** Apoio a times de P&D em modelagem físico-química e testes de caracterização.

---

## Arquitetura e Engenharia Front-End

O portal foi concebido com foco em máxima performance de carregamento, responsividade e estética visual sóbria alinhada ao setor *Deep Tech*:

- **Zero Dependências Externas de Runtime:** Código-fonte limpo em HTML5 semântico, folhas de estilo CSS3 nativas e JavaScript modular sem frameworks intermediários.
- **Design System Temático:** Interface escura (*Dark Mode*) com tipografia limpa e acentos em verde fluorescente, refletindo inovação biotecnológica e precisão laboratorial.
- **Otimização de Servidor (`.htaccess`):** Regras prontas para servidores Apache habilitando compressão Gzip (`mod_deflate`), políticas de cache estrito para imagens e fontes (`mod_expires`) e cabeçalhos de segurança HTTP.
- **Design Totalmente Responsivo:** Grid fluido adaptado para resoluções de desktop, tablets e smartphones.

---

## Estrutura do Repositório

```text
Joyle/
├── index.html          # Estrutura semântica principal e seções institucionais
├── .htaccess           # Diretrizes de compressão Gzip, cache e segurança Apache
├── public/             # Imagens corporativas, diagramas moleculares e favicons
├── src/                # Folhas de estilo modularizadas e fontes customizadas
├── scripts/            # Controladores de animação, scroll suave e formulários
├── LICENSE             # Termos de licenciamento do projeto
└── README.md           # Documentação técnica
```

---

## Como Executar Localmente

Como a aplicação não requer processos de compilação ou transpiladores, basta servi-la estaticamente:

### Usando Python 3

```bash
# Clone o repositório
git clone https://github.com/VituColombo0/Joyle.git
cd Joyle

# Inicie o servidor HTTP local
python3 -m http.server 3000
```
Acesse `http://localhost:3000` no navegador.

### Usando Node.js (npx)

```bash
npx serve .
```

---

## Publicação em Produção

- **Hospedagem Compartilhada / VPS com Apache:** O arquivo `.htaccess` incluso ativa automaticamente a compressão de texto e cabeçalhos de expiração de assets.
- **Nginx / Vercel / GitHub Pages:** Compatível nativamente; para Nginx, recomenda-se transpor as regras de cache do `.htaccess` para as diretivas `gzip` e `expires` no bloco `server`.

---

## Licença

Este projeto é distribuído sob a licença MIT. Consulte [LICENSE](LICENSE) para mais detalhes.

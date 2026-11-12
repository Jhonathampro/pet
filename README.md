# 🐾 PetHub — Hub de Saúde, Proteção e Adoção de Animais

**PetHub** é uma plataforma moderna, acolhedora e responsiva que conecta pessoas, ONGs e animais. O projeto foi desenvolvido como um **protótipo funcional** com **dados mockados**, simulando a experiência completa de uma rede comunitária de proteção animal.

> **Slogan:** *"Cuidar, proteger e encontrar um novo lar."*  
> **Conceito:** *"Um ponto de encontro entre quem quer ajudar, quem precisa de ajuda e quem procura um novo companheiro."*

---

## 🎨 Identidade Visual

- **Paleta de cores principal:** Preto (`#0f0e0d`), Marrom Terra (`#713f12` / `#b45309`), Branco Puro (`#ffffff`) e tons neutros aquecidos (sand, stone e creme).
- **Tipografia:** *Outfit* (títulos com personalidade e força) e *Plus Jakarta Sans* (leitura fluida e limpa).
- **Estética:** Proteção animal aliada à tecnologia, com cartões amplos, fotos reais em alta definição de cães e gatos, cantos arredondados, microinterações, badges informativos e sombras elegantes.

---

## 👥 Tipos de Usuário & Credenciais de Demonstração

A aplicação conta com autenticação mockada e uma **barra de alternância rápida de perfil no topo**:

| Tipo de Conta | E-mail | Senha | Experiência |
| :--- | :--- | :--- | :--- |
| **Usuário Comum** | `usuario@pethub.com` | `123456` | Adoção, denúncias, doação de ração e apoio financeiro. |
| **ONG Parceira** | `ong@pethub.com` | `123456` | Gestão de pets, interessados, estoque de ração e dados de PIX. |
| **Visitante** | *(Sem login)* | — | Navegação livre por todos os animais, mapa e banco de ração. |

---

## 🚀 Funcionalidades Principais

### 1. 🏠 Página Inicial (Home)
- **Hero Section Impactante:** Frase marcante, fotografia animal em destaque e 3 chamadas para ação principais (*Adotar um pet*, *Denunciar abandono*, *Encontrar uma ONG*).
- **Métricas Comunitárias:** Indicadores simulados de resgates, ONGs parceiras e ração arrecadada.
- **Destaques de Adoção:** Filtro rápido por espécie (Todos, Cães, Gatos) com cartões modernos.
- **Teaser do Mapa de Abandonos:** Gráfico visual ilustrando pontos e a regra dos 3 meses.
- **Atalhos para Banco de Ração & Apoio Direto a ONGs.**

### 2. 🐶 Portal de Adoção (`/adotar`)
- Catálogo com cards detalhados: foto, nome, espécie, raça, idade, sexo, cidade e ONG responsável.
- Filtros por:
  - Espécie (Cachorro / Gato)
  - Sexo (Macho / Fêmea)
  - Faixa Etária (Filhote, Jovem, Adulto, Sênior)
  - Cidade (São Paulo, Campinas, Curitiba, etc.)
  - ONG Responsável
  - Status do Animal
- **Modal de Detalhes do Pet:**
  - Galeria de fotos com miniaturas clicáveis;
  - Badges veterinários (Castrado, Vacinas em dia, Vermifugado);
  - Tags de personalidade (Brincalhão, Dócil, Sociável);
  - Ficha da ONG responsável com atalho para o perfil;
  - Disclaimer legal: *"A adoção é realizada diretamente com a ONG. O PetHub apenas facilita o encontro entre adotantes e organizações."*
  - Botão **"Tenho interesse em adotar"** com formulário mockado e feedback *"Seu interesse foi enviado para a ONG."*

### 3. 🏢 Diretório de ONGs (`/ongs`) & Perfil da ONG
- Listagem de organizações com cidade, descrição, número de animais sob cuidado e selos:
  - `✓ Recebe ração`
  - `✓ Disponibiliza ração`
  - `✓ Aceita doações financeiras`
- **Página de Perfil da ONG:**
  - Capa e logo institucional;
  - Informações de endereço completo e contatos (WhatsApp, E-mail, Instagram);
  - Catálogo de animais acolhidos exclusivamente por aquela organização;
  - Dados bancários e chave PIX oficial com botão de cópia rápida.

### 4. 🚨 Denúncia de Abandono (`/denunciar`)
- Formulário intuitivo para relato de animais desamparados:
  - Foto do animal (com galeria de pré-visualização ou URL personalizada);
  - Local do ocorrido (Rua, Número, Bairro, Cidade e UF);
  - Data do ocorrido e condição de saúde aparente (Sadio, Debilitado, Ferido);
  - Descrição detalhada dos fatos;
  - Confirmação imediata: *"Denúncia registrada."*
- **Avisos de Segurança e Confiabilidade:**
  - Esclarecimento de que relatos colaborativos não substituem boletins oficiais;
  - Botão **"Encaminhar denúncia às autoridades"** que abre modal informativo com diretrizes e telefones de emergência (190, 181, DEPA, IBAMA).

### 5. 🗺️ Mapa de Abandonos (`/mapa`)
- Visualizador interativo com marcação geográfica e coordenadas simuladas.
- Detalhes ao clicar no marcador:
  - Bairro e cidade do registro;
  - Data do relato;
  - Descrição da ocorrência;
  - Contagem de registros relacionados na região (ex: *"2 registros nesta região"*);
  - Botão para adicionar atualização/confirmação comunitária;
  - Botão para acionar autoridades.
- **⚖️ Regra de Expiração Comunitária (3 Meses):**
  - **Ativo:** Ocorrido há menos de 3 meses.
  - **Confirmado por múltiplos registros:** Mais de um relato comunitário na mesma área — permanece ativo permanentemente.
  - **Expirado:** Passados 3 meses sem novas confirmações — removido da visão pública padrão com opção de visualização de histórico.

### 6. 🥣 Banco de Ração Solidário (`/banco-racao`)
- Conecta: **Quem quer doar ração ↔ Quem precisa de ração**.
- Cards de necessidade: ONG ou protetor precisando de ração específica com quantidade em kg e botão `[Quero doar]`.
- Cards de disponibilização: Doadores ou ONGs com estoque excedente disponível e botão `[Tenho interesse]`.
- Modais interativos para publicação de ofertas ou solicitações de auxílio.

### 7. 💳 Apoio Financeiro Direto ("Ajude uma ONG" — `/doacoes`)
- Apresentação transparente das chaves PIX e contas bancárias informadas pelas ONGs.
- Botão de cópia da chave PIX e QR Code simulado.
- Fluxo de simulação de contribuição com registro no painel do usuário e da ONG.

### 8. 📊 Painéis de Controle (Dashboards)
- **Painel do Usuário:**
  - Cumprimento: *"Olá, João! 🐾"*;
  - Cartões de resumo métrico: *Interesses em adoção (2)*, *Denúncias registradas (3)*, *Doação realizada (1)*, *Solicitações de ração (1)*;
  - Abas para visualizar e acompanhar o status de cada item.
- **Painel da ONG:**
  - Cumprimento: *"Olá, ONG Patas que Salvam! 🐾"*;
  - Métricas de animais cadastrados, candidaturas recebidas, doações e ração;
  - Tabela administrativa de animais com ações de Visualizar, Editar e Excluir;
  - Botão **"+ Cadastrar animal"** com formulário completo;
  - Gestão de candidaturas de adoção com botões de status (*Em contato*, *Aprovado*);
  - Configuração de modalidades da ONG (Recebe ração: SIM/NÃO, Disponibiliza ração: SIM/NÃO, Aceita doações: SIM/NÃO, Chave PIX e conta).

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **TypeScript**
- **Vite**
- **CSS3 Moderno** com Custom Properties (Design System sob medida)
- **Ícones SVG** nativos e customizados
- **Persistência Local (LocalStorage)** para salvar novos animais, denúncias e interesses em tempo real durante o teste.

---

## 💻 Como Rodar o Projeto Localmente

1. No terminal do projeto, execute:
   ```bash
   npm run dev
   ```
2. Abra o link informado no navegador (geralmente `http://localhost:5173`).
3. Para gerar a versão de produção otimizada:
   ```bash
   npm run build
   ```

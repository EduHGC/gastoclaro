# 💡 GastoClaro

**GastoClaro** é uma aplicação voltada para monitorar o consumo de energia elétrica, com o objetivo de buscar estratégias para reduzir esse consumo.

---

## 🚀 Funcionalidades

- Tela de login  
- Tela de cadastro de usuários  
- Página inicial com navegação  
- Visualização de ambientes e painel de consumo  
- Lista de eletrodomésticos  
- Página de perfil do usuário  

---

## 🗂️ Estrutura do Projeto

├── index.html # Página principal
├── style.css # Estilos da página inicial
├── assets/ # Imagens e ícones do sistema
└── paginas/
  ├── home/ # Página inicial com lista de estabelecimentos, edição, exclusão e cadastro
  ├── ambientes/ # Lista de ambientes, edição, exclusão e cadastro
  ├── cadastro/ # Tela de cadastro de novo usuário
  ├── eletros/ # Lista de eletrodomésticos, edição, exclusão e cadastro
  ├── login/ # Tela de login (e-mail e conta Google)
  ├── perfil/ # Página de perfil do usuário
  └── util


---

## ⚙️ Como Usar

1. Crie uma conta no [Back4App](https://www.back4app.com) e inicie um novo dashboard.  
2. Na classe `_User`, adicione as colunas:
   - `nome` (String)
   - `sobrenome` (String)
   - `email` (String)
   - `data_nascimento` (Date)

3. Crie as seguintes tabelas com essas colunas:

Estabelecimentos:

id_usuario (Pointer para _User)

nome (String)

cep (String)

tipo (String)

endereco (String)

ambiente:

id_imovel (Pointer para Estabelecimentos)

nome (String)

eletrodomestico:

id_ambiente (Pointer para ambiente)

nome (String)

consumo (Number)

tempo_uso (Number)

fatura:

id_estabelecimento (Pointer para Estabelecimentos)

data_vencimento (Date)

meta_consumo:

id_estabelecimento (Pointer para Estabelecimentos)

data (Date)

consumo (Number)


4. Baixe ou clone este repositório.  
5. No Back4App, vá em **App Settings > Security & Keys**.  
6. Copie o **Application ID** e a **REST API Key**.  
7. Nos arquivos JavaScript que fazem requisições, cole essas chaves nas duas primeiras linhas (`APP_ID` e `API_KEY`).  
8. Crie um projeto no [Google Developer Console](https://console.developers.google.com/) e adicione o domínio local (localhost) para ativar o login com conta Google.  
9. Abra o arquivo `index.html` no navegador.  
10. Navegue pela aplicação pelos links da interface.  

> ⚠️ **Nota**: As chaves estão expostas neste repositório apenas por fins acadêmicos.

---

## 💻 Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript (`fetch` para requisições)  
- **Backend**: Back4App (Parse)

---

## 📜 Scripts JavaScript

### `paginas/utils.js`

- Verifica se há token de autenticação.  
- Impede acesso a páginas sem login.

### `paginas/ambientes/`

- `script.js`: Lista os ambientes com suas informações; permite editar e excluir; mostra painel de maior consumo e metas.  
- `scriptcadastrar.js`: Faz o cadastro de um novo ambiente.

### `paginas/cadastro/`

- `cadastrar.js`: Captura dados básicos do usuário e armazena em `sessionStorage`.  
- `scriptcred.js`: Pega os dados da `sessionStorage`, valida senha e e-mail, e envia a requisição de cadastro.

### `paginas/eletros/`

- `script.js`: Lista os eletrodomésticos cadastrados com possibilidade de edição e exclusão.  
- `scriptcadastrar.js`: Faz o cadastro de um novo eletrodoméstico.

### `paginas/home/`

- `script.js`: Lista os estabelecimentos; permite editar e excluir.  
- `scriptcadastrar.js`: Faz o cadastro de um novo estabelecimento.

### `paginas/login/`

- `script.js`: Executa login via e-mail ou conta Google, fazendo as requisições necessárias.

### `paginas/perfil/`

- `script.js`: Mostra e permite editar os dados do perfil do usuário.

---

## 📌 Observações

Este projeto tem finalidade **acadêmica** e foi desenvolvido como um estudo de integração entre Frontend e Backend utilizando serviços gratuitos.

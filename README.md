<h1 align="center" >
  <img alt="VFlows" title="VFlows" src="docs/assets/logoBranca.png" width="200px" style="background:#373435; padding:16px"/>
</h1>

<h3 align="center">
  Desafio para a vaga de Estágio em Front-End - VFLOWS
</h3>

<blockquote align="center">Tecnologia que flui!</blockquote>

<p align="center">
  <a href="#-Sobre-o-desafio">Sobre o desafio</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-Tecnologias">Tecnologias</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-Layout">Layout</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-Entrega">Entrega</a>
</p>

## 🚀 Sobre o desafio

Este projeto visa cumprir o desafio para vaga de estágio em Front-end da empresa VFLOWS. Seus objetivos são a avaliação de conhecimentos técnicos e a capacidade de arquitetar soluções.

Para o desafio, foi construído um formulário para cadastro de fornecedores e produtos.

O desenvolvimento do formulário seguiu o layout existente na guia: [Layout](#-layout)

## 📋 Tecnologias

- **HTML**;
- **JAVASCRIPT**;
- **CSS**:  
  - [BOOTSTRAP](https://getbootstrap.com/)
  - [JQUERY-3.7.1 ](https://jquery.com/)

- **CONSIDERAÇÕES**:
  - Foi utilizada a documentação de recursos e estilos conforme este [link](https://style.fluig.com/)
  

### Sobre o preenchimento dos campos existentes no formulário de cadastro

- **Razão Social**: obrigatório
- **Nome Fantasia**: obrigatório
- **CNPJ**: obrigatório
- **Inscrição Estadual**: opcional
- **Inscrição Municipal**: opcional
- **Endereço**: obrigatório (preenchido automaticamente usando a API via CEP)
- **Nome da pessoa de contato**: obrigatório
- **Telefone**: obrigatório
- **E-mail**: obrigatório
- **Tabela de Produtos**: obrigatório a inclusão de pelo menos 1 item
  - **Descrição**: obrigatório
  - **Unidade de Medida**: obrigatório
  - **Quantidade em Estoque**: obrigatório
  - **Valor Unitário**: obrigatório
  - **Valor Total**: obrigatório (bloqueado, preenchido automaticamente considerando o valor unitário * a quantidade em estoque)
- **Tabela de Anexos**: obrigatório a inclusão de pelo menos 1 documento
  - Os documentos anexados são armazenados em memória (blob e session storage) para envio
  - O Botão Excluir (lixeira) realiza a função de excluir o documento da memória
  - O Botão Visualizar (olho) realiza a função de visualizar o documento, realizando seu download
- **Botão Salvar Fornecedor**: ao clicar no botão, é confirmado para o usuário a finalização de preenchimento do formulário, além da formatação de um arquivo JSON com os dados a serem enviados, conforme exemplo: [jsonExemplo](./jsonExemplo/). O arquivo JSON é baixado para o usuário.

## 🎨 Layout

O layout do desafio está em anexo na pasta [docs](./docs/) deste repositório.

## 📅 Execução

Como este é um projeto front-end puro, não há necessidade de compilação ou instalação de pacotes complexos. Entretanto, para garantir que todas as funcionalidades funcionem corretamente, **é altamente recomendado executá-lo através de um servidor local.**

### Pré-requisitos

* Um navegador de internet moderno (Chrome, Firefox, Edge, etc.).
* [Git](https://git-scm.com/) instalado para clonar o repositório (opcional).
* Um editor de código como o [VS Code](https://code.visualstudio.com/) (recomendado).

### Recomendação: Usando a extensão "Live Server" no VS Code

1.  **Clone o repositório:**
    ```bash
    https://github.com/fernandozanette/VFLOWS-Intern.git
    ```
    Ou baixe o arquivo ZIP e extraia-o em uma pasta.

2.  **Abra o projeto no VS Code:**
    ```bash
    cd VFLOWS-Intern
    code .
    ```

3.  **Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer):**
    * Vá para a aba de Extensões (`Ctrl+Shift+X`).
    * Procure por `Live Server` e clique em **Install**.

4.  **Inicie o servidor:**
    * Com o projeto aberto, clique com o botão direito no arquivo `index.html`.
    * Selecione a opção **"Open with Live Server"**.
    * Alternativamente, clique no botão **"Go Live"** na barra de status, no canto inferior direito do editor.

---

Made by [Fernando Zanette](https://github.com/fernandozanette) to [VFlows](https://vflows.com.br)

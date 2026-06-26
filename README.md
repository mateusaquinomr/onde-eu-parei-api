# Onde Eu Parei - API

API REST da plataforma **Onde Eu Parei**, um sistema de gerenciamento de estudos baseado em ciclos, desenvolvido para auxiliar estudantes na preparação para ENEM e concursos públicos.

A API fornece toda a infraestrutura de dados necessária para o acompanhamento de progresso, organização de disciplinas e registro de sessões de estudo.

---

## Sobre o Projeto

O sistema implementa o método de **ciclos de estudos**, onde o estudante organiza disciplinas em sequência contínua, permitindo maior flexibilidade e consistência na rotina de estudos.

A API é responsável por estruturar e gerenciar esse fluxo de forma automatizada.

---

## Responsabilidades da API

- Autenticação e gerenciamento de usuários  
- Criação e gerenciamento de ciclos de estudo  
- Gerenciamento de disciplinas  
- Registro de sessões de estudo  
- Controle de progresso dentro do ciclo  
- Fornecimento de dados para métricas e desempenho  

---

## Arquitetura

A aplicação segue uma arquitetura baseada em **MVC (Model–View–Controller)** para separação de responsabilidades e melhor organização do código.

```
src
 ├ controllers
 ├ models
 ├ routes
 ├ services
 ├ middleware
 └ config
```

---

## Camadas da aplicação

- Controllers → requisições e respostas HTTP  
- Models → entidades e acesso ao banco de dados  
- Routes → definição dos endpoints  
- Services → regras de negócio e lógica reutilizável  
- Middleware → autenticação e validações  
- Config → configurações da aplicação  

---

## Tecnologias

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

---

## Integração com Frontend

Esta API é consumida pela aplicação web:

https://github.com/seu-usuario/onde-eu-parei

---

## Funcionalidades principais

- Cadastro e autenticação de usuários  
- Criação de ciclos de estudo  
- Gerenciamento de disciplinas  
- Controle de progresso  
- Registro de sessões de estudo  
- Dados para visualização de desempenho  

---

## Status do Projeto

Em desenvolvimento inicial.

---

## Desenvolvedor

Mateus de Aquino

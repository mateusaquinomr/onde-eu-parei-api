# Onde Eu Parei - API

API do **Onde Eu Parei**, uma plataforma web para **gerenciamento de estudos baseada em ciclos**, desenvolvida para ajudar estudantes a organizarem sua preparação para **ENEM e concursos públicos**.

A API é responsável por gerenciar usuários, disciplinas, ciclos de estudo e sessões de estudo, fornecendo os dados necessários para que a aplicação web acompanhe o progresso do estudante e permita retomar os estudos exatamente **de onde ele parou**.

---

## Sobre o projeto

O **Onde Eu Parei** foi criado para auxiliar estudantes que precisam lidar com **grande volume de conteúdo**, como ocorre em provas de **ENEM** e **concursos públicos**.

Muitos estudantes utilizam o método de **ciclo de estudos**, que consiste em estudar disciplinas em sequência, avançando continuamente e retomando o ponto onde pararam na sessão anterior.

A API fornece a infraestrutura necessária para que a aplicação:

* crie ciclos de estudo personalizados
* gerencie disciplinas
* registre sessões de estudo
* acompanhe o progresso dentro do ciclo
* forneça dados para análise de desempenho

---

## Responsabilidades da API

A API é responsável por:

* autenticação e gerenciamento de usuários
* criação e gerenciamento de ciclos de estudo
* gerenciamento de disciplinas dentro dos ciclos
* controle do progresso do estudante no ciclo
* registro de sessões de estudo
* fornecimento de dados para métricas e acompanhamento de desempenho

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

**Controllers**
Responsáveis por lidar com as requisições e respostas da API.

**Models**
Representação das entidades e comunicação com o banco de dados.

**Routes**
Definição dos endpoints da API.

**Services**
Camada responsável por regras de negócio e lógica reutilizável.

---

## Tecnologias

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## Integração com o Frontend

Esta API é utilizada pela aplicação web do projeto.

Repositório do frontend:

https://github.com/seu-usuario/onde-eu-parei-frontend

---

## Principais funcionalidades da API

* Cadastro e autenticação de usuários
* Criação de ciclos de estudo
* Gerenciamento de disciplinas
* Controle de progresso dentro do ciclo
* Registro de sessões de estudo
* Fornecimento de dados para visualização de desempenho

---

## Status do projeto

Em fase INICIAL.

---

## Autor

Mateus de Aquino

![](logo-lind.png)

# O que é o Lind?
Avoid HiPPO. Use Numbers. 
O Lind é uma ferramenta de teste A/B desenvolvido totalmente com Javascript.

## Requisitos

Para rodar o projeto são necessários:

```
- NODEJS
- NPM
- Gruntjs
```

## Configurando o projeto

Dentro de `src/js` criar um diretório `tests` e separar da seguinte forma:

`src/js/tests/NOMEDOPROJETO/desktop` e `src/js/tests/NOMEDOPROJETO/mobile`

Obs: Recomendamos a utilização de submodulos para os testes.

## Configuração de Testes

É preciso criar um arquivo `js ` que corresponderá aos seus testes dentro do diretório de desktop ou mobile do seu projeto.

### Exemplo:

Arquivo: `testExample.js`

```js
tests.testExample = {
  name: "Teste Exemplo",
  audience: 50,
  exception: null,
  triggerEvent: null,
  createdAt: 20170620,
  variants: {
    variantA: {
      name: "Teste Exemplo Padrão",
      audience: 50,
      method: function() {
        // Seu código vai aqui
      }
    },
    variantB: {
      name: "Teste Exemplo Mudanças",
      audience: 50,
      method: function() {
        // Seu código vai aqui
      }
    }
  }
};
```

### Parâmetros

#### test.testName {string}

Nome que será utilizado internamente pelo Lind. Utilizar regras de criação de variáveis do Javascript.

``` js
// Examples
tests.testExample = {}
tests.changeBg = {}
tests.Hidemodal = {}
```

#### name {string}

Nome do teste que será utilizado para exibição.

```js
name: "Teste Exemplo"
```

#### audience {integer}

Numero da audiência que será aplicada no teste. Números de 0 a 100.

```js
audience: 50
```

Obs: Somados com os outros testes não devem ultrapassar 100.

#### exception {null|function}

Regras de aplicação de teste. Caso retorne `false` o usuário será excluído do cenário de testes. Aguardando o tempo do cookie de `limbo` para ser novamente elegível a outro teste.

```js
// Null
exception: null

// Function
exception: function() {
  // Code here
}

// Sempre deve retornar TRUE ou FALSE
```

#### rule {null|function}

Determina a regra de acionamento da varição do teste. Enquanto `false`, o usuário não verá nenhuma variação do teste permanecendo com cookie de `delayed`. Caso retone `true`, ele será sorteado para as variações do teste.

```js
// Null
rule: null // Retorna true para todos os casos



// Function
rule: function() {
  return !!document.querySelector('.breadcrumb');
};
```

#### createdAt {integer}

Data em que o teste foi criado. Número inteiro no formato AAAAMMDD

```js
createdAt: 20170620
```

#### Variações

Define as possibilidades dentro de um teste, onde cada variação é um bloco de código que será executado quando sorteado levando em conta sua audiência.

```js
// Exemplo
...
variants: {
  variantA: {
    name: "Teste Exemplo Padrão", // Nome da variação do teste.
    audience: 50, // Audiência da variação do teste.
    method: function() {
      // Seu código vai aqui
    }
  },
  variantB: {
    name: "Teste Exemplo Mudanças",
    audience: 50,
    method: function() {
      // Seu código vai aqui
    }
  }
}
...
```

Caso seja necessário inserir mais variações no teste, deve-se incluir mais opções:

```js
// Exemplo
variants: {
  variantA: {
    audience: 25
  },
  variantB: {
    audience: 25
  },
  variantC: {
    audience: 25
  },
  variantD: {
    audience: 25
  }
}
```

Obs: Somadads as variações de um teste não devem ultrapassar 100.

## Como usar

No diretório do projeto execute o comando:

```sh
$ npm install
```

## Arquivos de desenvolvimento

Antes se iniciar o desenvolvimento executar o comando:

```sh
$ grunt core
```

#### Desktop

Para gerar a versão de desenvolvimento desktop execute:

```sh
$ grunt desktop --project=NOMEDOPROJETO
```

#### Mobile

Para gerar a versão de desenvolvimento mobile execute:

```sh
$ grunt mobile --project=NOMEDOPROJETO
```

Será gerado o diretório `dist/ ` e será iniciado a task de `watch` para desenvolvimento e ao mesmo tempo um servidor local apontando para a raiz da aplicação (Ver uso de proxy).

## Arquivos de produção

Para gerar a versão de produção mobile e desktop execute:

```sh
$ grunt build --project=NOMEDOPROJETO
```

Com esse comando serão gerados no diretório `dist` os arquivos para utilização em ambiente de produção. Sendo: `lindm.min.js` para versão mobile e `lindd.min.js` para versão desktop.


## Configurações do FTP

### Subindo para o FTP:

Para realizar o upload automático para o servidor é necessário configurar na raiz do projeto o arquivo `.ftpauth`.

```js
{
    "production":{
        "username":"NOMEDOUSUÁRIO",
        "password":"SENHADOUSUÁRIO!"
    }
}
```

Também é preciso configurar o `config.js` na raiz do projeto com os diretórios do projeto no FTP:

```JS
module.exports = {
  ftp_push_config: { // Configurações do FTP
    staging: {
      authKey: "staging",
      host: "lind.github.io",
      dest: "lind/staging/dist/",
      port: 21,
    },
    production: {
      authKey: "production",
      host: "lind.github.io",
      dest: "lind/prod/dist/",
      port: 21,
    }
  }
};
```

Para funcionar corretamente é preciso que o usuário possua permissão para modificar o diretório do `Lind`.

É preciso criar arquivo `.ftpauth` com os acessos do FTP. Utilize o modelo do `.ftpauth.example` como modelo.

### Comandos

```js
grunt build:prod --project=NOMEDOPROJETO || grunt build:staging --project=NOMEDOPROJETO
```

## Configuração do Dashboard:

É preciso realizar a configuração do path de js do dashboard em `/src/js/core/config.js`:

```JS
var CONFIG = {
  "cookieName": "lind_",
  "sortEmptyName": "withoutTest",
  "dashUrl": "" // URL do dash
};
```

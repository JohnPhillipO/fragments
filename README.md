# fragments

CCP555 API Server Setup

### Lint

```sh
npm run lint
```

There should be no errors when executed. Should look like this:

```sh
> fragments@0.0.1 lint
> eslint --config .eslintrc.js "./src/**/*.js"
```

### How to Start Server: npm start

How to start server:

```sh
npm start
```

There should be no errors when executed. Should look like this:

```sh
> fragments@0.0.1 start
> node src/server.js

{"level":30,"time":1694208363161,"pid":35868,"hostname":"DESKTOP-5LPEM7B","port":8080,"msg":"Server started"}
```

### How to Start Server: npm run dev

How to start server:

```sh
npm run dev
```

There should be no errors when executed. Should look like this:

```sh
> fragments@0.0.1 dev
> cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src

[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src\**\*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./src/server.js`
[17:28:34.054] INFO (3604): Server started
    port: 8080
```

### How to Start Server: npm run debug

How to start server:

```sh
npm run debug
```

There should be no errors when executed. When this command is executed via the VSCode terminal it will connect to the VSCode debugger and start debugging the file.

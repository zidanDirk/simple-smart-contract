# Simple Smart Contract in Action

## env
- node.js: v14.21.3


## install
truffle
```bash
npm -g install truffle
```

ganache
```bash
npm -g install ganache
```


## dev
启动本地区块链
```bash
ganache
```

初始化目录结构
```bash
truffle init
```

## deploy

```bash
cd migration

touch 1_deploy.js

// 编写发布脚本 ...

truffle migrate --reset
```

## test
```bash
mkdir scripts

touch test.js
// 编写测试脚本

truffle exec ./scripts/test.js
```



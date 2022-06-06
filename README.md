# X-Wallet

## 0. Node JS Version
```
12.22.5
```
## 1. NPM Install
```
# npm ci  --install
```

## 2. Build
```
# npm run build --build package
```

## 3. build dist with docker
```
# docker run --rm -it -w /app -v $(pwd):/app node:12.22.5 npm ci --install
# docker run --rm -it -w /app -v $(pwd):/app node:12.22.5 npm run build --build package
```

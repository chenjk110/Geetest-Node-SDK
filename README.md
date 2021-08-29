# Geetest-Node-SDK

## 示例 (Examples)

1. init
```ts
const gt = new Geetest({ geetestKey: '', geetestId: '' })
```

2. register
```ts

const { challenge, gt, success } = await gt.register()

```

3. validate
```ts

const isValid = await gt.validate({ seccode: '', validate: '', challenge: '' })
```

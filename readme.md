# 埋点监控SDK

跟着 小满zs 学的，学习目标：自己发布npm包

## 1.安装依赖包

```
npm install rollup -D  
npm install rollup-plugin-dts -D  
npm install rollup-plugin-typescript2 -D  
npm install typescript -D 
```

## 2.rollup.config.js配置

```
import path from 'path'
import plugin_ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
export default[
    {
        input: "./src/core/index.ts",
        output:[
            {
                file:path.resolve(__dirname,'./dist/index.esm.js'),
                format:"es"
            },
            {
                file:path.resolve(__dirname,'./dist/index.cjs.js'),
                format:"cjs"
            },
            {
                file:path.resolve(__dirname,'./dist/index.js'),
                format:"umd",
                name:"tracker"
            },
        ],
        plugins:[
            plugin_ts()
        ]
    },
    {
        input: "./src/core/index.ts",
        output:[
            {
                file:path.resolve(__dirname,'./dist/index.d.ts'),
                format:"es"
            }
        ],
        plugins:[dts()]
    }
]
```

然后到`package.json`中添加script ： 
```
    "build": "rollup -c"
```
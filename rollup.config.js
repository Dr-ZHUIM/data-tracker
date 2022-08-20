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
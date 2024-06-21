import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import json from '@rollup/plugin-json'
import { dependencies } from './package.json'

function getBanner() {
	const date = new Date();
	return (
`/*!
 * @license Copyright (c) ${ date.getFullYear() }, Portalnesia - Putu Aditya. All rights reserved.
 */`
	);
};

const array = [{
  name:"Portalnesia",
  src:"src/index.ts",
  dir:"dist",
},{
  name:"PNBlog",
  src:"src/blog/index.ts",
  dir:"dist/blog"
}]

const config = array.map((p,i)=>({
  input:p.src,
  output: [{
    file:p.dir+'/index.js',
    format:'cjs',
    name:p.name,
    banner: getBanner(),
    footer: "/* https://portalnesia.com */",
    minifyInternalExports:true,
    exports:'named'
  },{
    file:p.dir+'/index.mjs',
    format:'es',
    name:p.name,
    banner: getBanner(),
    footer: "/* https://portalnesia.com */",
    minifyInternalExports:true,
    exports:'named',
  },{
    file:p.dir+'/index.min.js',
    format:'iife',
    name:p.name,
    banner: getBanner(),
    footer: "/* https://portalnesia.com */",
    minifyInternalExports:true,
    exports:'named',
    plugins:[
      terser()
    ]
  }],
  plugins:[
    json(),
    nodeBuiltins({crypto:true}),
    nodeResolve({
      mainFields:['module','jsnext','main'],
      browser:true,
      extensions:['.mjs','.js','.cjs'],
      preferBuiltins:false
    }),
    commonjs({
      include:/\/node_modules\//,
      esmExternals:false,
      requireReturnsDefault:'namespace'
    }),
    typescript({
      ...(i===0 ? {
        tsconfigOverride:{
          compilerOptions:{
            declaration:true
          }
        }
      } :{})
    }),
    babel({
      babelHelpers:'bundled'
    })
  ]
}))

export default config;
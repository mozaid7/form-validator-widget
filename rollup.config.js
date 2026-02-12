import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy'; 
import { readFileSync } from 'fs';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

export default {
    input: 'src/index.ts',

    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'named'
        },
        {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
            exports: 'named'
        }
    ],

    external: [
    ...Object.keys(pkg.peerDependencies || {}),
    'tslib'  
    ],
    plugins: [
        resolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
        }),
        commonjs(),

        postcss({
            inject: true,        
            extract: false,      
            modules: false,      
            sourceMap: true,
            minimize: true,      
            extensions: ['.css'] 
        }),

        copy({
            targets: [
            { 
            src: 'src/styles/**/*.css', 
            dest: 'dist/styles' 
            }
            ]
        }),

        typescript({
        tsconfig: './tsconfig.json',
        tslib: await import('tslib')
        })
    ]
};
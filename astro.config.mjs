import { defineConfig } from 'astro/config';
import {config} from './config.js'
import {collect_content} from './integrations/integration-content-structure.js'
import node from '@astrojs/node'

let default_config = {
    outDir: config.outDir,
    output: config.output,
    integrations: [collect_content(config.collect_content)]
}

if(config.output == "server"){
    default_config.adapter = node({mode:'standalone'})
}

export default defineConfig(default_config);

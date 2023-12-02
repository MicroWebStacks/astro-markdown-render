import { defineConfig } from 'astro/config';
import {config} from './config.js'
import {collect_content} from './integrations/integration-content-structure.js'
import node from '@astrojs/node'

let default_config = {
    outDir: config.outDir,
    output: config.output,
    adapter: node({
      mode: 'standalone'
    }),
    //integrations: [collect_content(config.collect_content)]
}

export default defineConfig(default_config);

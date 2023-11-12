import { defineConfig } from 'astro/config';
import {config} from './config.js'
import {collect_content} from './integrations/integration-content-structure.js'
import netlify from '@astrojs/netlify/functions';

let default_config = {
    outDir: config.outDir,
    output: config.output,
    integrations: [collect_content(config.collect_content)]
}

if(config.output == "server"){
    default_config.adapter = netlify()
}

export default defineConfig(default_config);

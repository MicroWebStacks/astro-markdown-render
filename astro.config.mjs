import { defineConfig } from 'astro/config';
import {config} from './config.js'
import {collect_content} from './integrations/integration-content-structure.js'

const collect_content_config = {
    rootdir:config.rootdir,
    rel_contentdir:config.content,
    rel_outdir:config.content_out,
    debug:true,
    tags:{
        page:'page::(\\w+)'
    }
}

export default defineConfig({
    outDir: config.outDir,
    integrations: [collect_content(collect_content_config)]
});

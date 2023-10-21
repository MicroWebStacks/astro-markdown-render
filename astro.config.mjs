import { defineConfig } from 'astro/config';
import {config} from './config.js'
import {collect_content} from './integrations/integration-content-structure.js'

const collect_content_config = {
    rootdir:config.rootdir,
    rel_outdir:"gen"
}

export default defineConfig({
    outDir: config.outDir,
    integrations: [collect_content(collect_content_config)]
});

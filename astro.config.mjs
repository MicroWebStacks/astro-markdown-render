import { defineConfig } from 'astro/config';
import {config} from './config.js'
import {collect_content} from './integrations/integration-content-structure.js'

const collect_content_config = {
    rooturl:import.meta.url,
    rel_outdir:"gen"
}

export default defineConfig({
    outDir: config.outDir,
    integrations: [collect_content(collect_content_config)]
});

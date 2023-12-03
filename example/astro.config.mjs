import { defineConfig } from 'astro/config';
import {config} from './config.js'
import {collect_content} from './integrations/integration-content-structure.js'
import { markdown_render } from 'astro-markdown-render'

config.rootdir = dirname(fileURLToPath(import.meta.url));
config.collect_content.rootdir = config.rootdir

export default defineConfig({
  outDir: config.outDir,
  output: config.output,
  integrations: [
    collect_content(config.collect_content),
    markdown_render(config.markdown_render)
  ]
});

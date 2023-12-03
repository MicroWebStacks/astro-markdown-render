import {set_config} from './config.js'
import { markdown_render } from './integration/integration-astro-markdown-render.js';

function set_render_config(render_config){
    set_config(render_config)
}

export{
    set_render_config,
    markdown_render
}

export { default as AstroMarkdown } from './src/components/AstroMarkdown.astro';

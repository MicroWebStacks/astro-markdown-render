import {set_config} from './config.js'

function set_render_config(render_config){
    set_config(render_config)
}

export{
    set_render_config
}

export { default as AstroMarkdown } from './src/components/AstroMarkdown.astro';

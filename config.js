
import {set_config} from 'content-structure'

let config = {}

function set_config(new_config){
    config = new_config
    console.log("astro-markdown-render> set config:")
    console.log(config)
}

export {
    config,
    set_config
}

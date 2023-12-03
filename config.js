let config = Object.hasOwn(globalThis,"markdown_render")?globalThis.markdown_render:{}
console.log(`astro-markdown-render> config:`)
console.log(config)

function set_config(new_config){
    config = new_config
    console.log("astro-markdown-render> set config:")
    console.log(config)
    globalThis.markdown_render = config
}

export {
    config,
    set_config
}

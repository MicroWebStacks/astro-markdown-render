
const rootdir = Object.hasOwn(globalThis,"rootdir")?globalThis.rootdir:"."

let config = {
    rootdir:rootdir,
    outDir: "dist",
    content: "content",
    content_out: "dist",
    hashed_assets:false,
    copy_astro:false,
}

if(import.meta.env.DEV){
    config.content_out = "public"
}

config.markdown_render = {
    rootdir:rootdir,
    content: config.content,
    content_out:config.content_out,
    plantuml_server: "https://www.plantuml.com/plantuml/svg",
    kroki_server: "https://kroki.io"
}

config.collect_content = {
    rootdir:rootdir,
    rel_contentdir:config.content,
    rel_outdir:config.content_out,
    debug:false,
    tags:{
        page:'page::([\\w-.]+)'
    }
}

export {
    config
}

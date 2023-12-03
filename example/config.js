
let config = {
    rootdir: "",
    outDir: "dist",
    content: "content",
    content_out: "dist",
    hashed_assets:false,
    copy_astro:false,
}

config.markdown_render = {
    plantuml_server: "https://www.plantuml.com/plantuml/svg",
    kroki_server: "https://kroki.io"
}

config.collect_content = {
    rootdir:config.rootdir,
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

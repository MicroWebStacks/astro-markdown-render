import { fileURLToPath } from 'url';
import {join,basename,dirname} from 'path'
import {set_config} from 'content-structure'

const output = "static"
const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
console.log(`__dirname = ${__dirname}`)
if((output == "server") && (basename(__dirname) == "pages")){//identified server run mode
    __dirname = join(__dirname,"../../../..")
}else if(import.meta.env?.MODE == "production"){
	__dirname = join(__dirname,'../../..')
}


const config = {
    output:output,
    rootdir: __dirname,
    outDir: "dist",
    content: "content",
    content_out: "public",
    plantuml_server: "https://www.plantuml.com/plantuml/svg",
    kroki_server: "https://kroki.io",
    hashed_assets:false,
    copy_astro:false,
}

config.collect_content = {
    rootdir:config.rootdir,
    rel_contentdir:config.content,
    rel_outdir:config.content_out,
    debug:true,
    tags:{
        page:'page::([\\w-.]+)'
    }
}

console.log(config)

if(output == "server"){
    set_config(config.collect_content)
}

export {
    config
}

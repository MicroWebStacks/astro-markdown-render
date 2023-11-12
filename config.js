import { fileURLToPath } from 'url';
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
console.log(`__dirname = ${__dirname} ; MODE = ${import.meta.env?.MODE}`)
if(import.meta.env?.MODE == "production"){
	__dirname = join(__dirname,'../../..')
}

const config = {
    rootdir: __dirname,
    outDir: "dist",
    content: "content",
    content_out: "public",
    plantuml_server: "https://www.plantuml.com/plantuml/svg",
    kroki_server: "https://kroki.io",
    hashed_assets:false,
    copy_astro:false
}

console.log(config)

export {
    config
}

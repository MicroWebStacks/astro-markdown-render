import { fileURLToPath } from 'url';
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);

if(import.meta.env?.MODE == "production"){
	__dirname = join(__dirname,'../../..')
}

const config = {
    rootdir: __dirname,
    rel_outdir: "dist",
    outDir: "dist",
    plantuml_server: "https://www.plantuml.com/plantuml/svg",
    kroki_server: "https://kroki.io",
}

console.log(config)

export {
    config
}

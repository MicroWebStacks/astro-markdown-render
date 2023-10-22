import {collect} from 'content-structure'
import {config} from '../../config.js'

await collect({
    rootdir:config.rootdir,
    rel_contentdir:config.content,
    rel_outdir:config.content_out,
    debug:true
})

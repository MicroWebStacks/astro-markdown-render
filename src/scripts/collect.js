import {collect} from 'content-structure'
import {config} from '../../config.js'

await collect({
    rootdir:config.rootdir,
    rel_outdir:"gen"
})

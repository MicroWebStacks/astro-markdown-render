import slugify from 'slugify'
import {existsSync,copyFileSync,mkdirSync,statSync} from 'fs'
import {promises as fs} from 'fs';
import {resolve,dirname,join,relative} from 'path'
import {config} from '../../config.js'

function extractText(node){
    const text_list = [];
    
    function traverse(node) {
        if(node.type == "text"){
            text_list.push(node.value)
        }
        if (node.children) {
            for (const child of node.children) {
                traverse(child);
            }
        }
    }
    traverse(node)
    return text_list;
}


function title_slug(title){
  const slug = slugify(title,{lower:true})
  return slug
}

function node_slug(node){
    let text_list = extractText(node);
    text_list = text_list.map((text)=>(text.trim()))
    const text_string = text_list.join('-')
    const slug = slugify(text_string,{lower:true})
    return slug
}

function isNewer(filepath,targetfile){
  const t1 = statSync(filepath).mtime
  const t2 = statSync(targetfile).mtime
  return (t1>t2)
}

//Note 'imp*ort.me*ta.en*v.BA*SE_URL' only works from Astro component not from remark-rel-asset plugin
function relAssetToUrl(relativepath,refFile){
  const refdir = join("content",dirname(refFile))
    let newurl = relativepath
    const filepath = join(refdir,relativepath)
    console.log(`relAssetToUrl> filepath = ${filepath}`)
    if(existsSync(filepath)){
      //console.log(`   * impo*rt.me*ta.ur*l = ${import.meta.url}`)

      let rel_outdir = config.rel_outdir
      if(import.meta.env.MODE == "development"){
        rel_outdir = "public"
      }
      const targetroot = join(config.rootdir,rel_outdir,"raw")
      const filerootrel = relative(config.rootdir,refdir)
      const targetpath = resolve(targetroot,filerootrel)
      const targetfile = join(targetpath,relativepath)
      const targetdir = dirname(targetfile)
      //console.log(`copy from '${filepath}' to '${targetfile}'`)
      const newpath = join("raw/",filerootrel,relativepath)
      newurl = newpath.replaceAll('\\','/')
      if(!existsSync(targetdir)){
        mkdirSync(targetdir,{ recursive: true })
      }
      if(!existsSync(targetfile)){
        copyFileSync(filepath,targetfile)
        console.log(`utils.js> * new asset url = '${newurl}'`)
      }
      else if(isNewer(filepath,targetfile)){
        copyFileSync(filepath,targetfile)
        console.log(`utils.js> * updated asset url = '${newurl}'`)
      }else{
        console.log(`utils.js> * existing asset url = '${newurl}'`)
      }
    }

    return newurl
}

async function check_dir_create(dirname){
  const abs_dir = join(config.rootdir,dirname)
  console.log(abs_dir)
  try {
      await fs.access(abs_dir)
  } catch {
    console.log("mkdir")
    await fs.mkdir(abs_dir, { recursive: true });
  }
}

async function save_json(data,file_path){
  const filepath = join(config.rootdir,file_path)
  await fs.writeFile(filepath,JSON.stringify(data,undefined, 2))
  console.log(` saved json file ${filepath}`)
}

export{
    extractText,
    node_slug,
    relAssetToUrl,
    check_dir_create,
    save_json,
    title_slug
}

import {glob} from 'glob'
import { join, sep, basename, dirname, parse } from 'path';
import {promises as fs} from 'fs';
import { check_dir_create,save_json, get_next_uid } from '../libs/utils.js';
import { md_tree, title_slug, extract_headings,
        extract_tables,extract_images,extract_code,
        extract_paragraphs } from '../libs/md_utils.js';
import {config} from '../../config.js'
import matter from 'gray-matter';
import { createHash } from 'crypto';

function get_type(data){
    if(Object.hasOwn("type")){
        return data.type
    }else{
        return "generic"
    }
}

function get_slug(data,path,url_type){
    if(Object.hasOwn(data,"slug")){
        return data.slug
    }else if(Object.hasOwn(data,"title")){
        return title_slug(data.title)
    }else if(url_type == "dir"){
        return basename(dirname(path))
    }else{
        return parse(path).name
    }
}

let content_urls = new Map()

function get_uid(slug,type){
    let uid = (type === "generic") ? slug : `${type}/${slug}`
    if(!content_urls.has(type)){
        content_urls.set(type,[uid])    //create new list
    }else{
        uid = get_next_uid(uid,content_urls.get(type))
        content_urls.get(type).push(uid)
    }
    return uid
}

function get_sid(uid){
    const hash = createHash('md5')
    hash.update(uid)
    return hash.digest('hex').slice(0,8)
}

async function get_all_md_files(){
    const content_dir = join(config.rootdir,'content');
    process.chdir(content_dir)
    const results = await glob(content_dir+"/**/*.md")
    const files = results.map((file)=>(file.split(sep).join('/')))
    return files
}

async function collect_documents(files_paths){
    let content_entries = []
    for(const file_path  of files_paths){
        const url_type = (file_path.endsWith("readme.md")?"dir":"file")
        const abs_file_path = join(config.rootdir,"content",file_path)
        const text = await fs.readFile(abs_file_path,'utf-8')
        const {content, data} = matter(text)
        const slug = get_slug(data,file_path,url_type)
        const content_type = get_type(data)
        const uid = get_uid(slug,content_type)
        const sid = get_sid(uid)
        let entry       = {
            ...data,
            path:           file_path,
            content_type:   content_type,
            url_type:       url_type,
            slug:           slug,       //not unique
            uid:            uid,        //unique, fallback appending -1, -2,...
            sid:            sid         //short unique id
        }

        content_entries.push(entry)
    }
    return content_entries
}

async function parse_documents(content){
    for(const entry of content){
        const abs_file_path = join(config.rootdir,"content",entry.path)
        const text = await fs.readFile(abs_file_path,'utf-8')
        const {content, data} = matter(text)
        const tree = md_tree(content)
        const dir = `gen/documents/${entry.sid}/`
        await check_dir_create(dir)
        await save_json(tree,dir+"tree.json")

        const headings = extract_headings(tree)
        entry.headings = headings
        const tables = extract_tables(tree,headings)
        entry.tables = tables
        const images = extract_images(tree,headings)
        entry.images = images
        const code = extract_code(tree,headings)
        entry.code = code
        const paragraphs = extract_paragraphs(tree,headings)
        entry.paragraphs = paragraphs

        await save_json(entry,dir+"content.json")
    }
}

async function run(){
    const files_paths = await get_all_md_files()
    const documents = await collect_documents(files_paths)
    const content = {
        documents
    }
    
    await check_dir_create("gen")
    await save_json(content,"gen/index.json")
    await parse_documents(content.documents)
}

await run()

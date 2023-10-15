import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmTable} from 'micromark-extension-gfm-table'
import {gfmTableFromMarkdown} from 'mdast-util-gfm-table'
import slugify from 'slugify'
import { get_next_uid } from './utils.js'
import {visit} from "unist-util-visit";
import {basename,parse} from 'path'

function heading_from_line(headings,line){
    for(let i=headings.length-1;i>=0;i--){
        if(headings[i].line < line){
            return headings[i].slug
        }
    }
    return null
}

function node_text_list(node){
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

function image_slug(node){
    if(node.title !== null){
        return slugify(node.title,{lower:true})
    }
    if(node.alt !== null){
        return slugify(node.alt,{lower:true})
    }
    const filename = parse(basename(node.url)).name
    return slugify(filename,{lower:true})
    
}

function node_slug(node){
    let text_list = node_text_list(node);
    text_list = text_list.map((text)=>(text.trim()))
    const text_string = text_list.join('-')
    const slug = slugify(text_string,{lower:true})
    return slug
}

function node_text(node){
  let text_list = node_text_list(node);
  text_list = text_list.map((text)=>(text.trim()))
  return text_list.join(' ')
}

function md_tree(content){
    const tree = fromMarkdown(content,{
        extensions: [gfmTable()],
        mdastExtensions: [gfmTableFromMarkdown()]
    })
    return tree
}

function extract_headings(tree){
    let headings_list = []
    let heading_slug_list = []
    visit(tree, node=> {
        if (node.type === 'heading') {
            const heading_text = node_text(node)
            const heading_slug = title_slug(heading_text)
            const unique_heading_slug = get_next_uid(heading_slug,heading_slug_list)
            heading_slug_list.push(unique_heading_slug)
            headings_list.push({
                text:heading_text,
                slug:unique_heading_slug,
                depth:node.depth,
                line:node.position.start.line
            })
        }
    })
    return headings_list
}

function extract_tables(tree,headings){
    let tables_list = []
    let id = 1;
    visit(tree, node=> {
        if (node.type === 'table') {
            tables_list.push({
                id:`table-${id}`,
                heading:heading_from_line(headings,node.position.start.line),
                cells:node_text_list(node),
            })
            id+=1
        }
    })
    return tables_list
}
function extract_images(tree,headings,sid){
    let images_list = []
    let images_slug_list = []
    visit(tree, node=> {
        if (node.type === 'image') {
            const slug = image_slug(node)
            const unique_slug = get_next_uid(slug,images_slug_list)
            images_slug_list.push(unique_slug)
            images_list.push({
                id:unique_slug,
                heading:heading_from_line(headings,node.position.start.line),
                title:node.title,
                url:node.url,
                alt:node.alt,
                document:sid
            })
        }
    })
    return images_list
}
function extract_code(tree,headings){
    let result = []
    return result
}

//here we get paragraphs text only for search and returning sections 
//but without images, tables, code content (inlineCode stays as text)
function extract_paragraphs(tree,headings){
    let result = []
    return result
}

export{
    md_tree,
    extract_headings,
    extract_tables,
    extract_images,
    extract_code,
    extract_paragraphs,
    node_text_list,
    node_slug,
    title_slug,
    node_text
}

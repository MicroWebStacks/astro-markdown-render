import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmTable} from 'micromark-extension-gfm-table'
import {gfmTableFromMarkdown} from 'mdast-util-gfm-table'
import {extractText, node_slug} from '../libs/utils'

function extract_tables(node){
    let current_heading_slug = ""
    let tables_list = []
    function recursive_tables(node) {
        if (node.type === 'heading') {
            current_heading_slug = node_slug(node);
        } else if (node.type === 'table') {
            console.log(`Table in Heading: ${current_heading_slug}`);
            tables_list.push({
                heading: current_heading_slug,
                cells:extractText(node)
            })
        }

        if (node.children) {
            for (const child of node.children) {
                recursive_tables(child);
            }
        }
    }
    recursive_tables(node)
    return tables_list
}

function extract_paragraphs_text(node){
    let current_heading_slug = ""
    let paragraphs_list = []
    function recursive_tables(node) {
        if (node.type === 'heading') {
            current_heading_slug = node_slug(node);
        } else if (node.type === 'paragraph') {
            //console.log(`Paragraph in Heading: ${current_heading_slug}`);
            paragraphs_list.push({
                heading: current_heading_slug,
                text:extractText(node)
            })
        }

        if (node.children) {
            for (const child of node.children) {
                recursive_tables(child);
            }
        }
    }
    recursive_tables(node)
    return paragraphs_list
}

function node_type(node, depth){
    console.log(' '.repeat(depth * 2) + node.type);
}

function traverse(node, depth = 0) {
    node_type(node, 0)
    if (node.children) {
        for (const child of node.children) {
            traverse(child, depth + 1);
        }
    }
}

function md_tree(content){
    const tree = fromMarkdown(content,{
        extensions: [gfmTable()],
        mdastExtensions: [gfmTableFromMarkdown()]
    })
    return tree
}


export{
    md_tree,
    traverse,
    extract_tables,
    extract_paragraphs_text
}


const Article = {
  "name": "Article",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "author": "ArticleAuthor",
    "authorV2": "ArticleAuthor",
    "blog": "Blog",
    "comments": "CommentConnection",
    "content": "String",
    "contentHtml": "HTML",
    "excerpt": "String",
    "excerptHtml": "HTML",
    "handle": "String",
    "id": "ID",
    "image": "Image",
    "publishedAt": "DateTime",
    "seo": "SEO",
    "tags": "String",
    "title": "String",
    "url": "URL"
  },
  "implementsNode": true
};
export default Article;
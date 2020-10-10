module.exports = function (eleventyConfig) {
  // Aliases are in relation to the _includes folder
  eleventyConfig.addLayoutAlias("article", "layouts/article.html");
  eleventyConfig.addLayoutAlias("basic", "layouts/basic.html");
  eleventyConfig.addLayoutAlias("default", "layouts/default.html");
  eleventyConfig.addLayoutAlias("trail", "layouts/trail.html");
  eleventyConfig.setLiquidOptions({
    dynamicPartials: false,
    root: ["_includes", "."],
  });
  eleventyConfig.addCollection("rutas", (collection) => {
    return collection.getFilteredByGlob("rutas/**/*.md");
  });

  eleventyConfig.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("blog/**/*.md");
  });

  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("javascript");
  eleventyConfig.addPassthroughCopy("documents.json");

  return {
    dir: {
      input: "./", // Equivalent to Jekyll's source property
      output: "./_site", // Equivalent to Jekyll's destination property
    },
    passthroughFileCopy: true,
  };
};

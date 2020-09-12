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
    return collection.getFilteredByGlob("_rutas/*.md");
  });

  eleventyConfig.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("_blog/*.md");
  });

  return {
    dir: {
      input: "./", // Equivalent to Jekyll's source property
      output: "./_site", // Equivalent to Jekyll's destination property
    },
  };
};

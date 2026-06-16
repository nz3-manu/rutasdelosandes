const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  // --- TUS CONFIGURACIONES EXISTENTES ---
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

  // --- NUEVA CONFIGURACIÓN DE IMÁGENES ---
  eleventyConfig.addAsyncShortcode("image", async function(src, alt) {
    if(alt === undefined) {
      throw new Error(`Falta el atributo alt: ${src}`);
    }
    
    // Aquí el plugin procesa las imágenes
    let stats = await Image(src, {
      widths: [300, 600, 1000],
      formats: ["jpeg", "webp"],
      outputDir: "./_site/img/"
    });
    
    return Image.generateHTML(stats, {
      alt,
      loading: "lazy",
      sizes: "(max-width: 600px) 300px, 1000px"
    });
  });

  // --- ARCHIVOS QUE SE COPIAN DIRECTO ---
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("javascript");

  return {
    dir: {
      input: "./",
      output: "./_site",
    },
    passthroughFileCopy: true,
  };
};
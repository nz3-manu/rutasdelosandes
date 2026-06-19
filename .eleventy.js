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

  // --- NUEVA CONFIGURACIÓN: FILTRO DE FECHA PARA SITEMAP ---
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    // Si ya es un objeto Date, lo usamos; si no, intentamos crearlo
    const date = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    
    // Si la fecha es válida, devolvemos ISO, sino devolvemos la fecha actual
    return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
  });

  // --- COLECCIONES ---
  eleventyConfig.addCollection("rutas", (collection) => {
    return collection.getFilteredByGlob("rutas/**/*.md");
  });

  eleventyConfig.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("blog/**/*.md");
  });

  // --- CONFIGURACIÓN DE IMÁGENES ---
  eleventyConfig.addAsyncShortcode("image", async function(src, alt) {
    if(alt === undefined) {
      throw new Error(`Falta el atributo alt: ${src}`);
    }
    
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

  // --- ARCHIVOS PASSTHROUGH ---
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
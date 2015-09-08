module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: ["css/stylus/*.styl"],
      tasks: ["stylus"]
    },
    stylus: {
      "css/main.min.css": ["css/stylus/*.styl"],
      options: {
        globals: {
          compress: true
        }
      }
    },
    browserSync: {
      bsFiles: {
        src : [
          "*.html",
          "css/*.css",
          "js/*.js"
        ]
      },
      options: {
        watchTask: true,
        server: "./"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-stylus");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-browser-sync");

  grunt.registerTask("default", ["browserSync", "watch"]);

};

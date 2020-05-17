/**
 * Grunt configuration.
 */
module.exports = function(grunt) {
    // Init Sass config
    grunt.initConfig({
        sass: {
            dist: {
                files: [{
                    expand: true, // Allows us to specify the directory
                    cwd: './samples',
                    src: ['*.scss'],
                    dest: './compiled_css',
                    ext: '.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.registerTask('default', ['sass']);
};
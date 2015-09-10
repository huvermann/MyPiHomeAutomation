// Karma configuration
// Generated on Fri Aug 14 2015 13:11:01 GMT+0200 (Mitteleuropäische Sommerzeit)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
      //frameworks: ['jquery-1.3.2', 'jasmine-jquery', 'jasmine'],
    frameworks: ['jasmine-jquery', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      //'static/jquery/jquery-1.11.3.js',
      //'static/jquery/jquery.mobile-1.4.5.js',
      'static/scripts/*.js',
      'static/scripts/viewmodels/*.js',
      'static/scripts/tests/*.js'
      
    ],


    // list of files to exclude
    exclude: [
	'static/scripts/_references.js'
    //'static/jquery/*.*'
    
    //'static/scripts/pageManager.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'xml'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      //browsers: ['Chrome', 'IE', 'Firefox'],
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}

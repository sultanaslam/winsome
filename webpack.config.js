// path is already part of node.js so can just require it without npm install
var path = require('path');

// used for webpack.ProvidePlugin
var webpack = require('webpack');

// used for css-loader and purify-css
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// Both below lines used for purify-css
// use npm install for glob-all purifycss-webpack purify-css
const glob = require('glob-all');
var PurifyCSSPlugin= require('purifycss-webpack'); 

module.exports = {
  entry: './src/js/index.js',
  //as below needs absolute path and not relative
  output: {
    path: __dirname,
    filename: 'dist/js/bundle.js'
  },

  // allow webpack to auto rebuild
  watch: true,

  // defines what happens when an import statement happens
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          // you first load the basic babel functionality
          // these are babel-core and babel-loader
          loader: 'babel-loader',
          // you load the required submodules
          options: {
          // first type is type preset which is all of es6/es7/es8 packaged into one module
            presets: ['env', 'stage-3'],
          // second is type transforms loaded through plugins which are indivdual features loaded
         
          // Instead of plugin we could have loaded the whole preset called stage-3 which currently contains teh object spread operator
          //  plugins: ["transform-object-rest-spread", ]
          }
        }
      },
      {
        test:/\.css$/,
        //The extract text plugin is used to take the css file imported in the js file into a separate css file
        use: ExtractTextPlugin.extract({
          use: [ 
            {
              // The css loader is used to understand the css file
              loader: 'css-loader',
              options: {
                url: false
              }
            }
          ]
        })
      },
      {
        test:/\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [ 
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            // The sass loader file is used to understand the scss file and convert it to css
            // it requires both the sass-loader and the node-sass modules from npm
            'sass-loader'
          ]
        })
      }
    ]
  },

  plugins: [
    //Automatically provide dependencies to files expecting
    // certain globals to just be there.
    // new webpack.ProvidePlugin({
    //   '$': 'jquery',
    //   'jQuery': 'jquery'
    // }),
    new ExtractTextPlugin({
      filename: './dist/css/styles.css'
    }),
    // This is for optimizing the css file so that it removes any used css classes from the built css file
    // It works after the extract text plugin as that gives us the resulting css file
    // It takes the resulting css file and removes unused css classes before allowing the extract text plugin to save the result styles.css file
    // It finds the classes used by checking the html
    // This html is both static inside index.html and dynamic in js files
    new PurifyCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, 'dist/index.html'),
        path.join(__dirname, 'src/js/*.js')
      ])
    })
  ]
}
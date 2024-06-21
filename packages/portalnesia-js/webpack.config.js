'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );
const bannerPlugin = require('./extra/banner');
const nodeExternals = require('webpack-node-externals')

module.exports = {
	performance: { hints: false },
	mode:'production',
	devtool: 'source-map',
	target:'node',
	entry: {
		Portalnesia: path.resolve( __dirname, 'src', 'index.ts' ),
		PNBlog: path.resolve( __dirname, 'src', 'api/blog/index.ts')
	},
	output: {
		path: path.resolve( __dirname, 'dist'),
		filename: function(pathData){
			if(pathData.chunk.name === 'Portalnesia') return 'index.js';
			return pathData.chunk.name.replace(/^PN/i,'').toLowerCase() + '.js';
		},
		libraryTarget: 'umd',
		libraryExport: 'default',
		clean:true
	},

	optimization: {
		minimizer: [
			new TerserWebpackPlugin( {
				terserOptions: {
					output: {
						comments: /^!/
					}
				},
				extractComments: true
			} )
		]
	},

	plugins: [
		new webpack.BannerPlugin( {
			banner: bannerPlugin(),
			raw: true
		})
	],
	//externalsPresets:{node:true},
	externals:[nodeExternals({allowlist:['simple-oauth2']})],
	resolve: {
    extensions: [".ts", ".js"],
		alias:{
			url:path.resolve(__dirname,'extra/url')
		}
  },
	module: {
		rules: [
			{ test: /\.ts$/, loader: "ts-loader" }
		]
	}
};

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const bannerPlugin = require('./extra/banner');

module.exports = {
	performance: { hints: false },
	mode:'production',
	entry: {
		Portalnesia: path.resolve( __dirname, 'src', 'index.ts' ),
		PNBlog: path.resolve( __dirname, 'src', 'api/blog/index.ts' )
	},
	output: {
		library: '[name]',
		path: path.resolve( __dirname, 'dist','umd'),
		filename: '[name].min.js',
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
				extractComments: false
			} )
		],
		/*splitChunks: {
			cacheGroups:{
				portalnesia: {
					test:/[\\/](node_modules|(src\/index)|(src\/api\/base)|(src\/api\/oauth)|(src\/exception))[\\/]/,
					name: 'portalnesia',
					chunks:'all'
				}
			}
		}*/
	},

	plugins: [
		new webpack.BannerPlugin( {
			banner: bannerPlugin(),
			raw: true
		}),
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
			process: 'process/browser',
		}),
	],
	resolve: {
    extensions: [".ts", ".js"],
		plugins: [new TsconfigPathsPlugin()],
		fallback:{
			"stream": require.resolve("stream-browserify"),
			"url": false,
			"http": require.resolve("stream-http"),
			"zlib": false,
			"https": require.resolve("https-browserify"),
			"crypto": require.resolve("crypto-browserify"),
			"querystring": require.resolve("querystring-es3"),
			"buffer": require.resolve("buffer"),
			"assert": require.resolve("assert"),
			"util": require.resolve("util")
		}
  },
	module: {
		rules: [
			{ test: /\.ts$/, loader: "ts-loader" }
		]
	}
};

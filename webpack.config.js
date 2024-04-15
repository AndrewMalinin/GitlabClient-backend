const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
   mode: 'production',
   entry: {
      index: './src/app.ts',
   },
   optimization: {
      minimize: true,
      minimizer: [
         new TerserPlugin({
            extractComments: false,
         }),
      ],
   },
   module: {
      rules: [
         {
            test: /\.(ts)$/,
            use: [
               {
                  loader: 'ts-loader',
                  options: {
                     projectReferences: true,
                     transpileOnly: true,
                  },
               },
            ],
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyWebpackPlugin({
         patterns: [{from: `${__dirname}/src/config.json`, to: ''}],
      }),
   ],
   node: {
      __dirname: false,
      __filename: false,
   },
   target: 'node',
   resolve: {extensions: ['.ts', '.js']},
   performance: {
      hints: false,
   },
   output: {
      filename: '[name].js',
      libraryTarget: 'commonjs',
      path: path.resolve(__dirname, 'dist'),
   },
};

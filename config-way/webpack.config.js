const path = require('path');

module.exports = {
  entry: './code.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'code.js',
    path: path.resolve(__dirname),
  },
};
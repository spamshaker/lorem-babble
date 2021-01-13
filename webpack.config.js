const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {TsconfigPathsPlugin} = require('tsconfig-paths-webpack-plugin');

const templateContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lorem-babble</title>
</head>
<body>
  <div id="react-content"></div>
</body>
</html>
`;

module.exports = {
  mode: 'development',
  entry: 'packages/client/src/client.tsx',
  devtool: 'source-map',
  output: {
    publicPath: '/',
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  watch: false,
  target: 'web',
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false, // Set to true if you are using fork-ts-checker-webpack-plugin
            projectReferences: true
          }
        }
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname)],
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin({configFile: './packages/tsconfig.json', baseUrl: 'packages'})]
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `vendor/${packageName.replace('@', '')}`;
          }
        }
      }
    }
  }
};

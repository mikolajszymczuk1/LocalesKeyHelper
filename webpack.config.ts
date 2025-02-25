import path from 'path';
import type { Configuration } from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

const config: Configuration = {
  mode: isProduction ? 'production' : 'development',
  target: 'node',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: '/node_modules/',
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: false,
                decorators: true,
              },
              target: 'es2021',
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
              },
            },
            sourceMaps: !isProduction,
          },
        },
      },
    ],
  },
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  optimization: {
    minimize: isProduction,
  }
};

export default config;

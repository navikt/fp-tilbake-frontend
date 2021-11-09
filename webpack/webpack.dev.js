const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const commonDevAndProd = require('./webpack.common');
const { ModuleFederationPlugin } = require('webpack').container;

const ROOT_DIR = path.resolve(__dirname, '../public/client');
const PACKAGES_DIR = path.join(__dirname, '../packages');
const APP_DIR = path.resolve(PACKAGES_DIR, 'behandling-tilbakekreving/src');

const config = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    APP_DIR + '/index.ts',
  ],
  output: {
    publicPath: "auto",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ModuleFederationPlugin({
      name: "fp_tilbake_frontend",
      library: { type: "var", name: "fp_tilbake_frontend" },
      filename: "remoteEntry.js",
      exposes: {
        "./BehandlingTilbakekrevingIndex": "./packages/behandling-tilbakekreving/src/BehandlingTilbakekrevingIndex",
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};

module.exports = merge(commonDevAndProd, config);

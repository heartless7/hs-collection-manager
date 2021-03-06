import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import _debug from 'debug';
import history from 'connect-history-api-fallback';
import config from '../config';

const debug = _debug('app:server');
const paths = config.utils_paths;
const app = new express();
// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
app.use(history());

if (config.env === 'development') {
  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output;
  const compiler = webpack(webpackConfig);

  app.use(require('./middleware/webpack-dev')(compiler, publicPath));
  app.use(require('./middleware/webpack-hmr')(compiler));

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(paths.client('static')));
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(paths.base(config.dir_dist)));
}

export default app;

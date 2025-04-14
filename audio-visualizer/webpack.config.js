module.exports = {
    mode: 'production',
    entry: ['./src/loader.js', './src/navbar-menu.js'],
    output: {
      filename: './bundle.js'
    }
  };
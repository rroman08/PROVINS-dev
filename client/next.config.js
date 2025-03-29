// This file is used to configure Next.js settings.
module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};

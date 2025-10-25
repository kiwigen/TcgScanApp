module.exports = function (api) {
  api.cache(true);
  return {
      plugins: [
    ['react-native-worklets-core/plugin'],
        [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanOCR'],
      },
    ],
  ],
    presets: ['babel-preset-expo'],
  };
};

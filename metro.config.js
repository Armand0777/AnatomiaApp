// Metro bundler configuration para Anatomía App
// Resuelve compatibilidad de Supabase con React Native / Expo Go
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Habilitar package exports para que Supabase resuelva
// correctamente sus sub-paquetes (@supabase/realtime-js, etc.)
config.resolver.unstable_enablePackageExports = true;

// Condiciones de resolución: priorizar browser y react-native
// para evitar que Metro cargue los módulos de Node.js (ws, stream, zlib)
config.resolver.unstable_conditionNames = [
  'browser',
  'require',
  'react-native',
];

// Polyfill para stream en caso de que alguna dependencia
// transitiva lo necesite
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('readable-stream'),
};

module.exports = config;

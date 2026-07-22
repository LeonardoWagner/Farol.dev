import nextConfig from 'eslint-config-next';

// eslint-config-next 16 ships a native flat config array — no FlatCompat
// bridge needed (and none should be used: FlatCompat wrapping this preset
// hits a circular-reference bug in @eslint/eslintrc's config validator).
const eslintConfig = [...nextConfig, { ignores: ['legacy/**', 'out/**', '.next/**'] }];

export default eslintConfig;

// @ts-ignore
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "src/tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);

export const tailwindTheme = fullConfig.theme;

export default fullConfig;

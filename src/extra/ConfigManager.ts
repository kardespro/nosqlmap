export interface ConfigOptions {
  geminiApiKey?: string;
}

export function parseConfig(configString: string): ConfigOptions {
  const configOptions: ConfigOptions = {};
  const configPairs = configString.split(",");

  configPairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      if (key.trim() === "GEMINI_API_KEY") {
        configOptions.geminiApiKey = value.trim();
      }
    }
  });

  return configOptions;
}

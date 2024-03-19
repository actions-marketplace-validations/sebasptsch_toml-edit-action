import core from "@actions/core";
import * as toml from "smol-toml";
import { promises as fs } from "node:fs";

const bootstrap = async () => {
  const path = core.getInput("path", {
    required: true,
    trimWhitespace: true,
  });

  // Read the file
  const file = await fs.readFile(path, "utf-8").catch((error) => {
    throw new Error(`Failed to read the file: ${error.message}`);
  });

  const key = core.getInput("key", {
    required: true,
    trimWhitespace: true,
  });

  const value = core.getInput("value", {
    required: true,
    trimWhitespace: true,
  });

  const parsedToml = toml.parse(file);

  // If the key is a string, we can just set it directly
  // split the key by '.' and iterate through the keys to set the value

  const keys = key.split(".");
  let currentObject = parsedToml as Record<string, toml.TomlPrimitive>;
  for (let i = 0; i < keys.length - 1; i++) {
    if (currentObject[keys[i]] === undefined) {
      currentObject[keys[i]] = {};
    }
    currentObject = currentObject[keys[i]] as Record<
      string,
      toml.TomlPrimitive
    >;
  }
  currentObject[keys[keys.length - 1]] = value;
  core.setOutput("result", toml.stringify(parsedToml));

  // Write the file
  await fs.writeFile(path, toml.stringify(parsedToml)).catch((error) => {
    throw new Error(`Failed to write the file: ${error.message}`);
  });

  // Set the output
  core.setOutput("result", toml.stringify(parsedToml));
};

try {
  bootstrap();
} catch (error) {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else {
    core.setFailed("Unknown error");
  }
}

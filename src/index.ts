import * as core from "@actions/core";
import * as toml from "smol-toml";
import fs from "node:fs";

try {
  const path = core.getInput("path", {
    required: true,
    trimWhitespace: true,
  });

  // Read the file
  const file = fs.readFileSync(path, "utf-8");

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
  fs.writeFileSync(path, toml.stringify(parsedToml));

  // Set the output
  core.setOutput("result", toml.stringify(parsedToml));
} catch (error) {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else {
    core.setFailed("Unknown error");
  }
}

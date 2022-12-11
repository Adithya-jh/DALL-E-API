const { Configuration, OpenAIApi } = require("openai");
// const dotenv = require("dotenv").config({ path: "../.env" });
const fs = require("fs");

const commandLineArgs = require("command-line-args");

// const key = process.env.OPENAI_API_KEY;
const key = "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";

// console.log(key);

const optionDefinitions = [
  {
    name: "prompt",
    alias: "p",
    type: String,
    defaultValue: "Space with colourful starts bombarding",
  },
  { name: "number", alias: "n", type: Number, defaultValue: 1 },
  { name: "size", alias: "s", type: Number, defaultValue: 256 },
];
const options = commandLineArgs(optionDefinitions);

const configuration = new Configuration({
  apiKey: key,
});

const openai = new OpenAIApi(configuration);

const predict = async function () {
  const response = await openai.createImage({
    prompt: options.prompt,
    n: options.number,
    size: `${options.size}x${options.size}`,
    response_format: "b64_json",
  });

  return response.data;
};

predict().then((response) => {
  const now = Date.now();
  for (let i = 0; i < response.data.length; i++) {
    const b64 = response.data[i]["b64_json"];
    const buffer = Buffer.from(b64, "base64");
    const filename = `image_${now}_${i}.png`;
    console.log("Writing image " + filename);
    fs.writeFileSync(filename, buffer);
  }
});

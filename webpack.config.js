const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve("./public"),
  },
  module: {
    rules: [{ test: /\.ts/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve("src"),
      "@Entity": path.resolve("src/ecs/entity"),
      "@Component": path.resolve("src/ecs/component"),
      "@System": path.resolve("src/ecs/system"),
    },
  },
  devServer: {
    contentBase: path.resolve("./public"),
    port: 8080,
    hot: false, // this and next line disable hot reload
    inline: false,
  },
};

import webpack from "webpack";

export default (config: webpack.Configuration) => {
  return new Promise<webpack.Stats>((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err);
      if (!stats) return reject(new Error("Webpack stats undefined"));

      const info = stats.toJson();
      if (stats.hasErrors()) return reject(info.errors);
      if (stats.hasWarnings()) console.warn(info.warnings);

      resolve(stats);
    });
  });
};

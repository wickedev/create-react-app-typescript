const chalk = require("chalk");
const http = require("http");
const spawn = require("cross-spawn");
const path = require("path");
const fs = require("fs");

const throttle = delay =>
  new Promise((resolve, _) => setTimeout(resolve, delay));
const invertPromise = promise =>
  promise.then(() => Promise.reject(null), err => Promise.resolve());

const check = options =>
  new Promise((resolve, reject) => {
    const req = http.get(`http://${options.host}:${options.port}`, res => {
      const statusCode = res.statusCode || 400;
      statusCode < 400 ? resolve() : reject(new Error(`${statusCode}`));
      res.resume();
    });
    req.on("error", reject);
  });

const waitOn = (options, retries, delay) =>
  invertPromise(
    Array.from(Array(retries).keys()).reduce(
      promise =>
        promise
          .then(() => throttle(delay))
          .then(() => invertPromise(check(options))),
      invertPromise(check(options))
    )
  );

const modifiyPackageJson = appPackage => {
  appPackage.homepage = "./";
  appPackage.main = "./main/index.js";
  appPackage.scripts = Object.assign(appPackage.scripts, {
    clean: "rm -rf build releases",
  });
  appPackage.devDependencies = Object.assign(
    appPackage.devDependencies || {},
    appPackage.dependencies
  );
  appPackage.dependencies = {};
};

const clean = () => {
  const args = [
    "run",
    "clean"
  ];
  spawn.sync("npm", args, {
    stdio: "inherit"
  });
};

const build = () => {
  const args = [
    "run",
    "build"
  ];
  spawn.sync("npm", args, {
    stdio: "inherit"
  });
};

const buildPackage = () => {
  const args = [
    "--config",
    "electron-builder.json",
    "--dir"
  ];

  clean();
  build();
  spawn.sync("electron-builder", args, {
    stdio: "inherit"
  });
};

const buildRelease = (platforms) => {
  const args = [
    "--config",
    "electron-builder.json",
  ];

  clean();
  build();
  spawn.sync("electron-builder", args.concat(platforms), {
    stdio: "inherit"
  });
};

const startElectron = (port, onExit) => {
  const reqOptions = {
    host: "localhost",
    method: "GET",
    port
  };

  const electronBinPath = "./node_modules/.bin/electron";
  const args = [
    "--inspect",
    "-r",
    "ts-node/register",
    "./src/main/index.ts"
  ];
  const env = Object.assign({}, process.env, {
    TS_NODE_PROJECT: "tsconfig.electron.json"
  });

  return waitOn(reqOptions, 10, 1000).then(() => {
    const electron = spawn(electronBinPath, args, { env, stdio: "inherit" });
    console.log("Electron startet in development mode with --inspect.");
    electron.on("error", console.log);
    electron.on("close", onExit);

    return electron;
  });
};

const electronBuild = (pkg, debug) => {
  const proc = spawn(
    "./node_modules/.bin/tsc",
    ["-p", "tsconfig.electron.json"],
    {
      stdio: "inherit"
    }
  );

  proc.once("exit", exit => {
    if (exit !== 0) {
      console.log(chalk.red("Error while compiling electron sources.\n"));
      return;
    }
    console.log(chalk.green("Electron sources compiled successfully.\n"));
    const electronPkg = {
      author: pkg.author,
      name: pkg.name,
      main: pkg.main,
      version: pkg.version,
      description: pkg.description,
      dependencies: pkg.dependencies
    };

    fs.writeFileSync(
      path.resolve(process.cwd(), "build", "package.json"),
      JSON.stringify(electronPkg, null, 2)
    );
  });
};

module.exports = {
  electronBuild,
  modifiyPackageJson,
  startElectron,
  waitOn,
  clean,
  build,
  buildPackage,
  buildRelease
};
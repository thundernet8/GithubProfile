#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const prettier = require("prettier");

const prettierConfig = {
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    bracketSpacing: true,
    parser: "typescript"
};

const readRoutes = function() {
    const yamlFile = fs.readFileSync(path.join(__dirname, "../routes.yaml"));
    const yamlContent = yaml.safeLoad(yamlFile);

    const routes = yamlContent.map(item => {
        let { path: routePath, redirect, module: moduleName, chunk, exact } = item;
        return {
            routePath,
            redirect,
            moduleName,
            chunk,
            exact,
            componentName: chunk
                .split("")
                .map((item, index) => (index === 0 ? item.toUpperCase() : item))
                .join("")
        };
    });

    return routes;
};

const header = `/**\r\n * Generated on ${new Date().toGMTString()} \r\n * 本文件由routes.yaml模板生成, 请不要直接修改\r\n */\r\n\r\n`;

const genRoutes = () => {
    let codes = [header];
    const routes = readRoutes();
    const componentNames = [];
    routes.forEach(route => {
        if (componentNames.indexOf(route.componentName) < 0) {
            componentNames.push(route.componentName);
            codes.push(`import ${route.componentName} from "${route.moduleName}";`);
        }
    });

    codes.push(`\r\n\r\nconst routes = [`);
    routes.forEach(route => {
        if (!route.routePath) {
            route.routePath = "";
        }
        codes.push(
            `{path: "${route.routePath}", ${
                route.redirect ? "redirect: " + '"' + route.redirect + '"' + ", " : ""
            } exact: ${route.exact ? "true" : "false"}, component: ${route.componentName}},`
        );
    });
    codes.push(`];\r\n`);
    codes.push("\r\nexport default routes");

    return prettier.format(codes.join(""), prettierConfig);
};

const mainGen = () => {
    fs.writeFileSync(path.join(__dirname, "../src/routes.ts"), genRoutes());
};

mainGen();

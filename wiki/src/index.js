import http from 'http';
import serveStatic from 'serve-static';
import fs from 'fs';
import { argv, exit } from "process";

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import config from './config.json' assert {type: 'json'};
import PageCreator from './PageCreator.js';


const serve = () => {
    let serveRoot = serveStatic(config.outputDirectory, {
        index: 'index.html'
    });

    if (!fs.existsSync(config.outputDirectory)) {
        console.error('Site directory does not exist. Have you built the site yet?');
        exit();
    }

    const server = http.createServer((req, res) => {
        serveRoot(req, res, (req, res) => {
            return;
        });
    });

    server.listen(8080);
    if (server.listening) {
        console.log('Local server is running and listening on port 8080.\nGo to \'http://localhost:8080\' to view the wiki site.');
    } else {
        console.error('Failed to create local server');
        exit();
    }
}

const build = () => {
    let baseDir = __dirname.replace(/\/wiki.*/gi, "");
    let outputDir = config.outputDirectory  ? config.outputDirectory : "../site";

    let buildTimeStart = process.hrtime();

    const pageCreator = new PageCreator(baseDir, outputDir);
    pageCreator.buildSite();
    
    let buildTimeStop = process.hrtime(buildTimeStart);  
    console.log(`Successful build in ${Math.round(buildTimeStop[0] * 1000 + buildTimeStop[1] / 1000000)}ms`);
}

const start = () => {
    build();
    serve();
}

if (argv[2] == 'build') {
    build();
} else if (argv[2] == 'serve') {
    serve();
} else {
    start();
}
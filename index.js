import fs from 'fs';
import util from 'util';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import isPortReachable from "is-port-reachable";
import open from 'open';
import config from './config/config.json' assert { type: 'json' };

const formatDate = () => {
    let today = new Date();
    return today.toISOString().split('T')[0];
}

// Make Logs folder if one does not exist
if (!fs.existsSync('./Logs')) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    fs.mkdir(path.join(__dirname, './Logs'), (err) => {
        if (err) {
            return console.error(err);
        }
    });
}
//  Output console.log information to log_date.txt
const log_file = fs.createWriteStream(`./Logs/log_${formatDate()}.txt`, {flags : 'w'});
const log_stdout = process.stdout;
console.log = function(d) {
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};
for (let i = 0; i < config.external.length; i++) {
    if (await isPortReachable(config.external[i][1], {host: `${config.external[i][0]}`})) {
        console.log(`[OPEN] ${config.external[i][0]}:${config.external[i][1]}`);
    } else {
        console.log(`[CLOSED] ${config.external[i][0]}:${config.external[i][1]}`);
    }
}
// Open log file once finished
open(`./Logs/log_${formatDate()}.txt`);
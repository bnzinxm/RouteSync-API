const moment = require('moment-timezone');
const fs = require('fs');
const { format } = require('path');
const chalk = require('chalk');

const app_debug_mode = true;
const timezone_name = "Asia/Kolkata";
const msg_server_internal_error = "Server Internal Error";

module.exports = {
    ThrowHtmlError: (err, res) => {
        const currentTime = getCurrentTime();
        console.log(chalk.yellow(`[${currentTime}] [RouteSync API] [Error] `) + chalk.white('App is Helpers Throw Crash'));
        console.log(chalk.red(`[${currentTime}] [RouteSync API] [Error] `) + err.stack);

        fs.appendFile(`./crash_log/Crash${serverDateTime('YYYY-MM-DD HH mm ss ms')}.txt`, err.stack, (err) => {
            if (err) {
                console.log(chalk.red(`[${currentTime}] [RouteSync API] [Error] `) + err);
            }
        });

        if (res) {
            res.json({ 'status': '0', "message": msg_server_internal_error });
        }
    },

    ThrowSocketError: (err, client, eventName) => {
        const currentTime = getCurrentTime();
        console.log(chalk.yellow(`[${currentTime}] [RouteSync API] [SocketError] `) + chalk.white('App is Helpers Throw Crash'));
        console.log(chalk.red(`[${currentTime}] [RouteSync API] [SocketError] `) + err.stack);

        fs.appendFile(`./crash_log/Crash${serverDateTime('YYYY-MM-DD HH mm ss ms')}.txt`, err.stack, (err) => {
            if (err) {
                console.log(chalk.red(`[${currentTime}] [RouteSync API] [SocketError] `) + err);
            }
        });

        if (client) {
            client.emit(eventName, { 'status': '0', "message": msg_server_internal_error });
        }
    },

    CheckParameterValid: (res, jsonObj, checkKeys, callback) => {
        const currentTime = getCurrentTime();
        let isValid = true;
        let missingParameter = "";

        checkKeys.forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                isValid = false;
                missingParameter += key + " ";
            } else {
                // Verificando tipo de dados (exemplo para lat e lon)
                if ((key === 'lat' || key === 'lon') && isNaN(parseFloat(jsonObj[key]))) {
                    isValid = false;
                    missingParameter += `Invalid value for ${key} `;
                }
            }
        });

        if (!isValid) {
            console.log(chalk.red(`[${currentTime}] [RouteSync API] [Warn] Missing or invalid parameter(s): ${missingParameter}`));
            res.json({ 'status': '0', "message": `Missing or invalid parameter(s): ${missingParameter}` });
        } else {
            return callback();
        }
    },

    CheckParameterValidSocket: (client, eventName, jsonObj, checkKeys, callback) => {
        const currentTime = getCurrentTime();
        let isValid = true;
        let missingParameter = "";

        checkKeys.forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(jsonObj, key)) {
                isValid = false;
                missingParameter += key + " ";
            }
        });

        if (!isValid) {
            console.log(chalk.red(`[${currentTime}] [RouteSync API] [SocketWarn] Missing parameter(s): ${missingParameter}`));
            client.emit(eventName, { 'status': '0', "message": "Missing parameter (" + missingParameter + ")" });
        } else {
            return callback();
        }
    },

    Dlog: (log) => {
        if (app_debug_mode) {
            const currentTime = getCurrentTime();
            console.log(chalk.blue(`[${currentTime}] [RouteSync API] [Debug] `) + log);
        }
    },

    serverDateTime: (format) => {
        return serverDateTime(format);
    },

    serverYYYYMMDDHHmmss: () => {
        return serverYYYYMMDDHHmmss();
    }
};

function getCurrentTime() {
    return moment().tz(timezone_name).format('YYYY-MM-DD HH:mm:ss');
}

function serverDateTime(format) {
    return moment().tz(timezone_name).format(format);
}

function serverYYYYMMDDHHmmss() {
    return serverDateTime('YYYY-MM-DD HH:mm:ss');
}

process.on('uncaughtException', (err) => {
    const currentTime = getCurrentTime();
    console.log(chalk.red(`[${currentTime}] [RouteSync API] [UncaughtException] `) + err.stack);
});
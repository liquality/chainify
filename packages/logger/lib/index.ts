const LogLevels: { [name: string]: number } = { debug: 1, default: 2, info: 2, warning: 3, error: 4, off: 5 };
let _logLevel = LogLevels['default'];

let _globalLogger: Logger = null;

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    OFF = 'OFF',
}

export class Logger {
    readonly version: string;

    static levels = LogLevel;

    constructor(version: string) {
        this.version = version;
    }

    public debug(...args: Array<any>): void {
        this._log(Logger.levels.DEBUG, args);
    }

    public info(...args: Array<any>): void {
        this._log(Logger.levels.INFO, args);
    }

    public warn(...args: Array<any>): void {
        this._log(Logger.levels.WARNING, args);
    }

    public error(...args: Array<any>): void {
        this._log(Logger.levels.ERROR, args);
    }

    public static globalLogger(): Logger {
        if (!_globalLogger) {
            _globalLogger = new Logger('global');
        }
        return _globalLogger;
    }

    public static setLogLevel(logLevel: LogLevel): void {
        const level = LogLevels[logLevel.toLowerCase()];
        if (level == null) {
            Logger.globalLogger().warn('invalid log level - ' + logLevel);
            return;
        }
        _logLevel = level;
    }

    public static from(version: string): Logger {
        return new Logger(version);
    }

    private _log(logLevel: LogLevel, args: Array<any>): void {
        const level = logLevel.toLowerCase();
        if (LogLevels[level] == null) {
            Logger.globalLogger().debug('invalid log level name', 'logLevel', logLevel);
        }
        if (_logLevel > LogLevels[level]) {
            return;
        }
        // eslint-disable-next-line prefer-spread
        console.log.apply(console, [`${logLevel}: ${this.version}: `, ...args]);
    }
}

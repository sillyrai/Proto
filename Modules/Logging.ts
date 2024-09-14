import ansi from 'ansi-colors'

function getTimeString(){ // YY/MM/DD HH:MM:SS
    let date = new Date();
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` 
}

function internal_write(message: string, type: string) {
}

export default {
    info: (message: string) => {
        internal_write(message, "INF");
        console.log(`[${ansi.gray(getTimeString())}] [${ansi.green("INF")}] > ${message}`)
    },
    warn: (message: string) => {
        internal_write(message, "WARN");
        console.log(`[${ansi.gray(getTimeString())}] [${ansi.yellow("WRN")}] > ${message}`)
    },
    error: (message: any) => {
        internal_write(message, "ERR");
        console.log(`[${ansi.gray(getTimeString())}] [${ansi.red("ERR")}] > ${message}`)
    },
    debug: (message: string) => {
        internal_write(message, "DBG");
        console.log(`[${ansi.gray(getTimeString())}] [${ansi.blue("DBG")}] > ${message}`)
    },
    fatal: (message: any) => {
        internal_write(message, "FTL");
        console.log(`[${ansi.gray(getTimeString())}] [${ansi.magenta("FTL")}] > ${message}`)
    },
    ok: (message: string) => {
        internal_write(message, "OK");
        console.log(`[${ansi.gray(getTimeString())}] [${ansi.green(` ${ansi.symbols.check} `)}] > ${message}`)
    },
    RAW: (message: string) => {
        internal_write(message, "RAW");
        console.log(`[${ansi.gray(getTimeString())}] ${message}`)
    }
}
const readline = require('readline')

console.clear = function () { // Clears console
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
}

console.break = function () { // Logs an empty line
    console.log(' ')
}
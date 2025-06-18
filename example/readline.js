function stepRead(callback) {
    const input = process.stdin;
    const output = process.stdout;
    let line = '';
    emitKeypressEvents(input)
    input.on('keypress', onKeyPress);
    input.resume()
}

function onKeyPress(s) {
    output.write(s)
    line += s;
    switch (s) {
        case '\r':
            input.pause();
            callback(s);
            break;
    }
}

function emitKeypressEvents(stream) {
    function onData(chunk) {
        g.next(chunk.toString())
    }
    const g = emitKeys(stream)
    g.next()

    stream.on('data', onData)
}
function* emitKeys() {
    while (true) {
        let ch = yield;
        stream.emit('keypress', ch);
    }
}
stepRead(function (s) {
    console.log('answer:', s)
})
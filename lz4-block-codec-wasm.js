

'use strict';

/******************************************************************************/

(function(context) {                    // >>>> Start of private namespace

/******************************************************************************/

let wd = (function() {
    let url = document.currentScript.src;
    let match = /[^\/]+$/.exec(url);
    return match !== null ?
        url.slice(0, match.index) :
        '';
})();

let growMemoryTo = function(wasmInstance, byteLength) {
    let lz4api = wasmInstance.exports;
    let neededByteLength = lz4api.getLinearMemoryOffset() + byteLength;
    let pageCountBefore = lz4api.memory.buffer.byteLength >>> 16;
    let pageCountAfter = (neededByteLength + 65535) >>> 16;
    if ( pageCountAfter > pageCountBefore ) {
        lz4api.memory.grow(pageCountAfter - pageCountBefore);
    }
    return lz4api.memory.buffer;
};

let encodeBlock = function(wasmInstance, inputArray, outputOffset) {
    let lz4api = wasmInstance.exports;
    let mem0 = lz4api.getLinearMemoryOffset();
    let hashTableSize = 65536 * 4;
    let inputSize = inputArray.byteLength;
    if ( inputSize >= 0x7E000000 ) { throw new RangeError(); }
    let memSize =
        hashTableSize +
        inputSize +
        outputOffset + lz4api.lz4BlockEncodeBound(inputSize);
    let memBuffer = growMemoryTo(wasmInstance, memSize);
    let hashTable = new Int32Array(memBuffer, mem0, 65536);
    hashTable.fill(-65536, 0, 65536);
    let inputMem = new Uint8Array(memBuffer, mem0 + hashTableSize, inputSize);
    inputMem.set(inputArray);
    let outputSize = lz4api.lz4BlockEncode(
        mem0 + hashTableSize,
        inputSize,
        mem0 + hashTableSize + inputSize + outputOffset
    );
    if ( outputSize === 0 ) { return; }
    let outputArray = new Uint8Array(
        memBuffer,
        mem0 + hashTableSize + inputSize,
        outputOffset + outputSize
    );
    return outputArray;
};

let decodeBlock = function(wasmInstance, inputArray, inputOffset, outputSize) {
    let inputSize = inputArray.byteLength;
    let lz4api = wasmInstance.exports;
    let mem0 = lz4api.getLinearMemoryOffset();
    let memSize = inputSize + outputSize;
    let memBuffer = growMemoryTo(wasmInstance, memSize);
    let inputArea = new Uint8Array(memBuffer, mem0, inputSize);
    inputArea.set(inputArray);
    outputSize = lz4api.lz4BlockDecode(
        mem0 + inputOffset,
        inputSize - inputOffset,
        mem0 + inputSize
    );
    if ( outputSize === 0 ) { return; }
    return new Uint8Array(memBuffer, mem0 + inputSize, outputSize);
};

/******************************************************************************/

context.LZ4BlockWASM = function() {
    this.lz4wasmInstance = undefined;
};

context.LZ4BlockWASM.prototype = {
    flavor: 'wasm',

    init: function() {
        if (
            typeof WebAssembly !== 'object' ||
            typeof WebAssembly.instantiateStreaming !== 'function'
        ) {
            this.lz4wasmInstance = null;
        }
        if ( this.lz4wasmInstance === null ) {
            return Promise.reject();
        }
        if ( this.lz4wasmInstance instanceof WebAssembly.Instance ) {
            return Promise.resolve(this.lz4wasmInstance);
        }
        if ( this.lz4wasmInstance === undefined ) {
            this.lz4wasmInstance = WebAssembly.instantiateStreaming(
                fetch(wd + 'lz4-block-codec.wasm', { mode: 'same-origin' })
            ).then(result => {
                this.lz4wasmInstance = undefined;
                this.lz4wasmInstance = result && result.instance || null;
                if ( this.lz4wasmInstance !== null ) { return this; }
                return null;
            });
            this.lz4wasmInstance.catch(( ) => {
                this.lz4wasmInstance = null;
                return null;
            });
        }
        return this.lz4wasmInstance;
    },

    reset: function() {
        this.lz4wasmInstance = undefined;
    },

    bytesInUse: function() {
        return this.lz4wasmInstance instanceof WebAssembly.Instance ?
            this.lz4wasmInstance.exports.memory.buffer.byteLength :
            0;
    },

    encodeBlock: function(input, outputOffset) {
        if ( this.lz4wasmInstance instanceof WebAssembly.Instance === false ) {
            throw new Error('LZ4BlockWASM: not initialized');
        }
        if ( input instanceof ArrayBuffer ) {
            input = new Uint8Array(input);
        } else if ( input instanceof Uint8Array === false ) {
            throw new TypeError();
        }
        return encodeBlock(this.lz4wasmInstance, input, outputOffset);
    },

    decodeBlock: function(input, inputOffset, outputSize) {
        if ( this.lz4wasmInstance instanceof WebAssembly.Instance === false ) {
            throw new Error('LZ4BlockWASM: not initialized');
        }
        if ( input instanceof ArrayBuffer ) {
            input = new Uint8Array(input);
        } else if ( input instanceof Uint8Array === false ) {
            throw new TypeError();
        }
        return decodeBlock(this.lz4wasmInstance, input, inputOffset, outputSize);
    }
};

/******************************************************************************/

})(this || self);                       // <<<< End of private namespace

/******************************************************************************/
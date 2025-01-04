export class WasmGlue {
    private instance: WebAssembly.Instance | null = null;
    private memory: WebAssembly.Memory | null = null;

    constructor() {
        this.callFunction = this.callFunction.bind(this);
        this.toWasm = this.toWasm.bind(this);
        this.fromWasm = this.fromWasm.bind(this);
        this.passArrayToWasm = this.passArrayToWasm.bind(this);
        this.passObjectToWasm = this.passObjectToWasm.bind(this);
        this.passStringToWasm = this.passStringToWasm.bind(this);
        this.getStringFromWasm = this.getStringFromWasm.bind(this);
        this.malloc = this.malloc.bind(this);
        this.free = this.free.bind(this);
    }

    // Load a WASM module dynamically
    async loadWasm(url: string): Promise<void> {
        const response = await fetch(url);
        const bytes = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(bytes, {
            env: {
                __wbindgen_malloc: (size: number) => this.malloc(size),
                __wbindgen_free: (ptr: number, size: number) => this.free(ptr, size),
            },
        });

        this.instance = wasmModule.instance;
        this.memory = this.instance.exports.memory as WebAssembly.Memory;
    }

    // Call a WASM function with automatic type conversion
    callFunction(name: string, ...args: any[]): any {
        if (!this.instance) {
            throw new Error("WASM module is not loaded.");
        }
    
        // Get the function from WASM exports
        const func = this.instance.exports[name];
        if (typeof func !== "function") {
            throw new Error(`Function ${name} not found in WASM exports.`);
        }
    
        // Convert arguments to WASM-compatible values
        const wasmArgs = args.map(arg => this.toWasm(arg));
        const result = func(...wasmArgs);
    
        // Return a wrapped object with an `expect` method
        return {
            expect: (type: string) => {
                switch (type) {
                    case 'bigint':
                        return BigInt(result);
                    case 'number':
                        return result;
                    case 'boolean':
                        return !!result;
                    case 'string':
                        return this.getStringFromWasm(result);
                    case 'array':
                        return this.getArrayFromWasm(result);
                    case 'object':
                        return this.getObjectFromWasm(result);
                    case 'tuple':
                        return this.getTupleFromWasm(result);
                    default:
                        throw new Error(`Unsupported type: ${type}`);
                }
            },
        };
    }
    

    // Convert a JS value to a WASM-compatible value
    private toWasm(value: any): any {
        if (typeof value === 'string') {
            return this.passStringToWasm(value);
        } else if (typeof value === 'bigint') {
            return [Number(value & BigInt(0xFFFFFFFF)), Number(value >> BigInt(32))];
        } else if (Array.isArray(value)) {
            return this.passArrayToWasm(value);
        } else if (typeof value === 'object' && value !== null) {
            return this.passObjectToWasm(value);
        }
        return value; // For primitive types (numbers, booleans)
    }

    // Convert a WASM value to a JS-compatible value
    private fromWasm(value: any): any {
        if (Array.isArray(value)) {
            return BigInt(value[0]) | (BigInt(value[1]) << BigInt(32));
        }
        if (value > 0x80000000) {
            return this.getStringFromWasm(value);
        }
        return value;
    }

    // Pass a string to WASM and return a pointer
    private passStringToWasm(str: string): number {
        const encodedStr = new TextEncoder().encode(str);
        const ptr = this.malloc(encodedStr.length + 1);
        new Uint8Array(this.memory!.buffer, ptr, encodedStr.length).set(encodedStr);
        new Uint8Array(this.memory!.buffer)[ptr + encodedStr.length] = 0; // Null-terminate the string
        return ptr;
    }

    // Pass an array to WASM as a JSON string
    private passArrayToWasm(array: any[]): number {
        return this.passStringToWasm(JSON.stringify(array));
    }

    // Pass an object to WASM as a JSON string
    private passObjectToWasm(obj: Record<string, any>): number {
        return this.passStringToWasm(JSON.stringify(obj));
    }

    // Get a string from WASM memory
    private getStringFromWasm(ptr: number): string {
        const memory = new Uint8Array(this.memory!.buffer);
        let end = ptr;
        while (memory[end] !== 0) end++;
        const bytes = memory.slice(ptr, end);
        return new TextDecoder().decode(bytes);
    }

    private getArrayFromWasm(ptr: number): any[] {
        const jsonString = this.getStringFromWasm(ptr);
        return JSON.parse(jsonString);
    }

    private getObjectFromWasm(ptr: number): object {
        const jsonString = this.getStringFromWasm(ptr);
        return JSON.parse(jsonString);
    }

    private getTupleFromWasm(ptr: number): [any, any] {
        const jsonString = this.getStringFromWasm(ptr);
        return JSON.parse(jsonString);
    }
    

    // Allocate memory in WASM
    private malloc(size: number): number {
        const m = this.instance!.exports.malloc as Function;
        console.log(m);
        return m(size);
    }

    // Free memory in WASM
    private free(ptr: number, size: number): void {
        const f = this.instance!.exports.free as Function;
        f(ptr, size);
    }
}

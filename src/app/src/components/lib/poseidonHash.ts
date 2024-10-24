// poseidonHash.ts

export function poseidonHash(inputVec: number[]): string {
  if (!inputVec || inputVec.length === 0) {
    throw new Error("Input vector is empty or undefined.");
  }

  const securityLevel = 128;
  const inputRate = 3;
  const t = 4;
  const alpha = 5;

  // Define the prime and parameters
  const prime255 = BigInt(
    "57896044618658097711785492504343953926634992332820282019728792003956564819949"
  );
  const parameters = {
    prime255,
    securityLevel,
    alpha,
    inputRate,
    t,
  };

  // Ported Poseidon class from Python
  class Poseidon {
    prime: bigint;
    securityLevel: number;
    alpha: number;
    inputRate: number;
    t: number;

    constructor(
      prime: bigint,
      securityLevel: number,
      alpha: number,
      inputRate: number,
      t: number
    ) {
      this.prime = prime;
      this.securityLevel = securityLevel;
      this.alpha = alpha;
      this.inputRate = inputRate;
      this.t = t;
    }

    runHash(inputVec: number[]): bigint {
      let result = BigInt(0);
      for (let i = 0; i < this.t; i++) {
        if (i < inputVec.length) {
          result += BigInt(inputVec[i]);
        }
        result = this._poseidonFunction(result);
      }
      return result;
    }

    private _poseidonFunction(input: bigint): bigint {
      return input ** BigInt(this.alpha) % this.prime;
    }
  }

  // Create a new instance of Poseidon and run the hash
  const poseidon = new Poseidon(
    parameters.prime255,
    parameters.securityLevel,
    parameters.alpha,
    parameters.inputRate,
    parameters.t
  );
  const poseidonOutput = poseidon.runHash(inputVec);

  return "0x" + poseidonOutput.toString(16);
}

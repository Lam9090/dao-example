/**
 * DON'T MODIFY OR DELETE THIS SCRIPT (unless you know what you're doing)
 *
 * This script generates the file containing the contracts Abi definitions.
 * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
 * This script should run as the last deploy script.
 */

import * as fs from "fs";
import { DeployFunction } from "hardhat-deploy/types";

const ARTIFACTS_CONTRACTS_DIR = "./artifacts/contracts";
const TARGET_DIR = "../abis";
function getAbiFromArtifacts() {
  const dirs = fs.readdirSync(ARTIFACTS_CONTRACTS_DIR, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

  const descriptions = [];

  for (const dir of dirs) {
    const path = `${ARTIFACTS_CONTRACTS_DIR}/${dir.name}/${dir.name.split(".")[0]}.json`;
    if (fs.existsSync(path)) {
      descriptions.push(
        JSON.parse(fs.readFileSync(`${ARTIFACTS_CONTRACTS_DIR}/${dir.name}/${dir.name.split(".")[0]}.json`).toString()),
      );
    }
  }
  return descriptions;
}

/**
 * Generates the TypeScript contract definition file based on the json output of the contract deployment scripts
 * This script should be run last.
 */
const generatePureAbi: DeployFunction = async function () {
  const allContractsData = getAbiFromArtifacts();

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR);
  }
  for (const contract of allContractsData) {
    fs.writeFileSync(`${TARGET_DIR}/${contract.contractName}.json`, JSON.stringify(contract.abi));
  }
};

export default generatePureAbi;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags generatePureAbi
generatePureAbi.tags = ["generatePureAbi"];

generatePureAbi.runAtTheEnd = true;

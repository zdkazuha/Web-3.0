import { BrowserProvider, Contract, ethers, Signer } from "ethers";

const contractAddress = "0x662E2624b641A74A116E15756ca03389E4d189Ec"; // Replace with your contract address
const abi = [
        {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "manager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "members",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "winner",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "join",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getWinner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMembers",
      "outputs": [
        {
          "internalType": "address payable[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

declare global {
  interface Window {
    ethereum?: any;
  }
}

const getProvider = (): BrowserProvider | null => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async (): Promise<Signer | null> => {
  try {
    const provider = getProvider();
    return provider ? await provider.getSigner() : null;
  } catch (error) {
    console.error("MetaMask connection error:", error);
    return null;
  }
};

export const getContract = async (): Promise<Contract | null> => {
  const signer = await getSigner();
  return signer ? new Contract(contractAddress, abi, signer) : null;
};

const withContract = async (
  action: (contract: Contract) => any,
): Promise<any | void> => {
  const contract = await getContract();
  if (!contract) return;
  try {
    return await action(contract);
  } catch (error) {
    console.error("Contract interaction error:", error);
  }
};

export const join = async (): Promise<void> => {
  await withContract(async (contract) => {
    const tx = await contract.join({ value: ethers.parseEther("1") });
    await tx.wait();
    return true;
  });
}

export const getMembers = async (): Promise<string[] | void> => {
  return await withContract(async (contract) => {
    const result: string[] = await contract.getMembers();
    return result;
  }) ?? [];
};

export const getWinner = async (): Promise<string | void> => {
  return await withContract(async (contract) => {

    const members = await contract.getMembers();
    if (members.length === 0) {
      console.log("No members in lottery");
      return;
    }

    const tx = await contract.getWinner();
    await tx.wait();

    return await contract.winner();
  });
};
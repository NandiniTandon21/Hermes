import {JsonRpcSigner} from "ethers";

const {ethers} = await import("ethers");

interface HyperlaneClient {
    sourceChain: number;
    signer: JsonRpcSigner;
}

export const HyperlaneClientFactory = async (sourceChainId: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error MetaMask injects `ethereum` at runtime
    if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask (or another EIP-1193 provider) not detected.");
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error MetaMask injects `ethereum` at runtime
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const current = await provider.getNetwork();
    if (BigInt(current.chainId) !== BigInt(sourceChainId)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error MetaMask injects `ethereum` at runtime
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: ethers.toQuantity(sourceChainId)}],
        });
    }

    return {
        "sourceChain": sourceChainId,
        "signer": signer,
    }
}

export const crossChainHyperlaneMessage = async (
    client: HyperlaneClient,
    destinationChainId: number,
    recipientAddress: string,
    messageText: string,
    mailboxAddress: string
) => {
    const MAILBOX_ABI = [
        "function dispatch(uint32 destinationDomain, bytes32 recipientAddress, bytes message) external",
    ];
    const mailbox = new ethers.Contract(mailboxAddress, MAILBOX_ABI, client.signer);


    const destinationDomain = Number(destinationChainId);
    const recipientBytes32 = ethers.zeroPadValue(recipientAddress, 32);
    const messageBytes = ethers.toUtf8Bytes(messageText);

    const tx = await mailbox.dispatch(
        destinationDomain,
        recipientBytes32,
        messageBytes,
    );

    return tx.wait()
}

export const crossChainHyperlaneGasPayment = async (
    client: HyperlaneClient,
    destinationChainId: number,
    gasAmount: number,
    messageID: string,
    igpAddress: string,
) => {
    const IGP_ABI = [
        "function quoteGasPayment(uint32 destinationDomain, uint256 gasAmount) external view returns (uint256)",
        "function payForGas(bytes32 messageId,uint32 destinationDomain,uint256 gasAmount,address refundAddress) external payable returns (uint256)"
    ];

    const igp = new ethers.Contract(igpAddress, IGP_ABI, client.signer);
    const destinationDomain = Number(destinationChainId);

    const quoteGas: bigint = await igp.quoteGasPayment(
        destinationDomain,
        Number(gasAmount),
    ) as bigint;

    const tx = await igp.payForGas(
        messageID,
        destinationDomain,
        Number(gasAmount),
        client.signer.address,
        {value: quoteGas},
    );

    return tx.wait()
}
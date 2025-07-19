# 🌿 GreenProof - Decentralized Carbon Offset Marketplace

GreenProof is a blockchain-based platform that brings transparency, trust, and accessibility to the global carbon offset market. By tokenizing verified carbon credits and enabling peer-to-peer trading and retirement, GreenProof empowers individuals and companies to make meaningful contributions to climate action—backed by real data and open-source technology.

---

## 🌍 Problem Statement

The traditional carbon offset market is plagued by:

- Lack of transparency
- Greenwashing and unverifiable claims
- Centralized control by brokers and registries
- Inefficient tracking and double-counting of carbon credits

GreenProof addresses these issues with decentralized smart contracts, on-chain verification, and an open marketplace.

---

## ✅ Key Features

- **Carbon Credit NFTs:** Tokenized offsets representing 1 ton of CO₂ each
- **Validator Governance:** Community-approved environmental validators
- **Offset Marketplace:** Trade, donate, or retire carbon credits
- **On-Chain Transparency:** Every transaction and retirement is public and verifiable

---

## 🧱 Smart Contract Architecture

### 1. `CarbonCreditToken.sol` (ERC-1155 / ERC-721)
Represents tokenized carbon credits. Each token contains metadata about the offset project, including:
- Project name and description
- CO₂ offset amount (e.g., 1 ton)
- Validator identity
- Expiry date or vintage

### 2. `ValidationRegistry.sol`
A governance-controlled registry that:
- Maintains a list of approved carbon offset validators
- Enables DAO members to vote on adding/removing validators

### 3. `OffsetMarketplace.sol`
Facilitates:
- Listing and purchasing of carbon credit tokens
- Retiring (burning) tokens to claim offset
- Public logs for verification

---

## 🔁 Workflow

1. **Validator Approval**: An environmental NGO or third-party auditor is added to the registry.
2. **Token Minting**: A validator verifies a project and mints carbon credit tokens.
3. **Marketplace Listing**: Tokens are listed for sale or donation.
4. **Retirement**: Buyers can retire tokens to officially offset their carbon footprint.

---

## 🛠️ Tech Stack

| Layer        | Tech                       |
|--------------|----------------------------|
| Blockchain   | Ethereum / Polygon         |
| Smart Contracts | Solidity + Hardhat        |
| Storage      | IPFS (project metadata)    |
| Frontend     | React + Ethers.js          |
| Oracles      | Chainlink (for off-chain validation) |

---

## 🚀 Getting Started

### 🧪 Prerequisites
- Node.js & npm
- MetaMask or another Web3 wallet
- Hardhat (development environment)

### 📦 Install Dependencies

```bash
npm install

# Reputation System DApp

A full-stack decentralized application for managing on-chain reputation using soulbound tokens (SBTs).  
Built with Solidity (Hardhat) and React.

---

## Features

- **Reputation Scores:** Assign and track reputation for any wallet address.
- **Soulbound Tokens (SBTs):** Mint non-transferable NFTs representing reputation levels.
- **Action System:** Complete actions (e.g., vote, verify, complete task) to earn reputation.
- **Dynamic Levels:** Add new reputation levels and action types on-chain.
- **Adminless Demo:** All features are accessible to any connected wallet (for demo/testing).

---

## Project Structure

```

/ReputationFinal         \# Hardhat backend (Solidity contracts)
/reputation-frontend     \# React frontend (UI)

```

---

## Getting Started
   https://reputation-frontend-koxohx3yn-ripperoxs-projects.vercel.app/
## Usage

- **Connect Wallet:** Click "Connect Wallet" to use your Ethereum wallet (MetaMask, etc.).
- **View Profile:** See your reputation score, level, and SBT status.
- **Complete Actions:** Select and complete actions to increase your reputation.
- **Add Actions/Levels:** Add new action types and reputation levels.
- **Modify Reputation:** Increase or decrease reputation for any address.

---

## Deployment

### Deploy Frontend to Vercel

1. Push your frontend code to GitHub.
2. Go to [vercel.com](https://vercel.com), import your repo, and deploy.
3. Or, use the CLI:
```

cd reputation-frontend
vercel --prod

```

---

## Security Note

&gt; **This demo version allows any user to access all features.  
&gt; For production, restrict sensitive functions to the contract owner or admins.**

---

## License

MIT

---

## Credits

- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [Hardhat](https://hardhat.org/)
- [Vercel](https://vercel.com/)
- [Ethers.js](https://docs.ethers.org/)

---

## Screenshots

![image](https://github.com/user-attachments/assets/fe372d4c-ca4a-41a6-8f5e-872950d7747d)


---

## Contact

For questions or contributions, open an issue or pull request on GitHub.
```

---


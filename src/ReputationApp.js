import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./ReputationSystemABI.json";

const CONTRACT_ADDRESS = "0x26270A1E69E5976A6671209F633E22A8e6F67cb1";

function ReputationApp() {
  const [account, setAccount] = useState("");
  const [score, setScore] = useState(null);
  const [level, setLevel] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [tokenUri, setTokenUri] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [actionTypes, setActionTypes] = useState(["VOTE_IN_DAO", "COMPLETE_TASK", "VERIFY_ACCOUNT"]);
  const [selectedAction, setSelectedAction] = useState("VOTE_IN_DAO");
  const [newActionType, setNewActionType] = useState("");
  const [newActionPoints, setNewActionPoints] = useState("");
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelThreshold, setNewLevelThreshold] = useState("");
  const [newLevelUri, setNewLevelUri] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [reputationAmount, setReputationAmount] = useState("");

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setStatus("Connecting wallet...");
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        setStatus("");
      } catch (error) {
        setStatus("Failed to connect wallet: " + error.message);
      }
    } else {
      setStatus("Please install MetaMask");
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    if (!account) return;
    setLoading(true);
    setStatus("Loading data...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, provider);
      const userScore = await contract.reputationScores(account);
      setScore(userScore.toString());
      const userTokenId = await contract.addressToTokenId(account);
      setTokenId(userTokenId.toString());
      const [levelId, levelName] = await contract.getReputationLevel(account);
      setLevel(levelName);
      setStatus("");
    } catch (error) {
      setStatus("Error loading data");
    }
    setLoading(false);
  };

  // Fetch token URI
  const fetchTokenUri = async () => {
    if (!tokenId || tokenId === "0") return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, provider);
      const uri = await contract.tokenURI(tokenId);
      setTokenUri(uri);
    } catch (error) {
      setStatus("Error fetching token URI");
    }
  };

  // Complete an action
  const completeAction = async () => {
    if (!account) return;
    setLoading(true);
    setStatus(`Completing action: ${selectedAction}...`);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
      const tx = await contract.completeAction(account, selectedAction);
      await tx.wait();
      setStatus(`Action completed: ${selectedAction}`);
      fetchUserData();
    } catch (error) {
      setStatus("Error: " + error.message.substring(0, 50));
    }
    setLoading(false);
  };

  // Add new action type
  const addActionType = async () => {
    if (!newActionType || !newActionPoints) return;
    setLoading(true);
    setStatus(`Adding new action type: ${newActionType}...`);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
      const tx = await contract.addActionType(newActionType, newActionPoints);
      await tx.wait();
      setActionTypes([...actionTypes, newActionType]);
      setNewActionType("");
      setNewActionPoints("");
      setStatus(`Added new action type: ${newActionType}`);
    } catch (error) {
      setStatus("Error: " + error.message.substring(0, 50));
    }
    setLoading(false);
  };

  // Add new reputation level
  const addReputationLevel = async () => {
    if (!newLevelName || !newLevelThreshold || !newLevelUri) return;
    setLoading(true);
    setStatus(`Adding new reputation level: ${newLevelName}...`);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
      const tx = await contract.addReputationLevel(newLevelName, newLevelThreshold, newLevelUri);
      await tx.wait();
      setNewLevelName("");
      setNewLevelThreshold("");
      setNewLevelUri("");
      setStatus(`Added new reputation level: ${newLevelName}`);
    } catch (error) {
      setStatus("Error: " + error.message.substring(0, 50));
    }
    setLoading(false);
  };

  // Increase reputation
  const increaseReputation = async () => {
    if (!targetAddress || !reputationAmount) return;
    setLoading(true);
    setStatus(`Increasing reputation for ${targetAddress}...`);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
      const tx = await contract.increaseReputation(targetAddress, reputationAmount);
      await tx.wait();
      if (targetAddress.toLowerCase() === account.toLowerCase()) {
        fetchUserData();
      }
      setStatus(`Increased reputation for ${targetAddress} by ${reputationAmount} points`);
    } catch (error) {
      setStatus("Error: " + error.message.substring(0, 50));
    }
    setLoading(false);
  };

  // Decrease reputation
  const decreaseReputation = async () => {
    if (!targetAddress || !reputationAmount) return;
    setLoading(true);
    setStatus(`Decreasing reputation for ${targetAddress}...`);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
      const tx = await contract.decreaseReputation(targetAddress, reputationAmount);
      await tx.wait();
      if (targetAddress.toLowerCase() === account.toLowerCase()) {
        fetchUserData();
      }
      setStatus(`Decreased reputation for ${targetAddress} by ${reputationAmount} points`);
    } catch (error) {
      setStatus("Error: " + error.message.substring(0, 50));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (account) {
      fetchUserData();
    }
  }, [account]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("");
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  if (!account) {
    return (
      <div className="dashboard-grid">
        <div className="card" style={{gridColumn: "1 / span 2", textAlign: "center"}}>
          <button onClick={connectWallet} disabled={loading}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
          {status && <div className="status">{status}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {/* Profile Card */}
      <div className="card">
        <div className="card-title">Your Profile</div>
        <p><b>Address:</b> {`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
        <p><b>Reputation Score:</b> {score !== null ? score : "Loading..."}</p>
        <p><b>Level:</b> <span className="level">{level || "Loading..."}</span></p>
        <p><b>SBT Status:</b> {tokenId && tokenId !== "0" ? <span className="sbt">Minted (ID: {tokenId})</span> : "Not Minted"}</p>
        {tokenId && tokenId !== "0" && (
          <button onClick={fetchTokenUri} disabled={loading}>
            {tokenUri ? "Hide Token Metadata" : "View Token Metadata"}
          </button>
        )}
        {tokenUri && (
          <p><b>Token URI:</b> {tokenUri}</p>
        )}
      </div>

      {/* Actions Card */}
      <div className="card">
        <div className="card-title">Complete Action</div>
        <div className="input-group">
          <label htmlFor="action-select">Select Action:</label>
          <select 
            id="action-select"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            disabled={loading}
          >
            {actionTypes.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
        <button onClick={completeAction} disabled={loading}>
          {loading ? "Processing..." : "Complete Action"}
        </button>
      </div>

      {/* Add New Action Type */}
      <div className="card">
        <div className="card-title">Add New Action Type</div>
        <div className="input-group">
          <label htmlFor="new-action">Action Name:</label>
          <input
            id="new-action"
            type="text"
            placeholder="e.g., STAKE_TOKENS"
            value={newActionType}
            onChange={(e) => setNewActionType(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="action-points">Points:</label>
          <input
            id="action-points"
            type="number"
            placeholder="e.g., 30"
            value={newActionPoints}
            onChange={(e) => setNewActionPoints(e.target.value)}
            disabled={loading}
          />
        </div>
        <button 
          onClick={addActionType} 
          disabled={loading || !newActionType || !newActionPoints}
        >
          Add Action Type
        </button>
      </div>

      {/* Add Reputation Level */}
      <div className="card">
        <div className="card-title">Add Reputation Level</div>
        <div className="input-group">
          <label htmlFor="level-name">Level Name:</label>
          <input
            id="level-name"
            type="text"
            placeholder="e.g., Legend"
            value={newLevelName}
            onChange={(e) => setNewLevelName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="level-threshold">Threshold:</label>
          <input
            id="level-threshold"
            type="number"
            placeholder="e.g., 3000"
            value={newLevelThreshold}
            onChange={(e) => setNewLevelThreshold(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="level-uri">Token URI:</label>
          <input
            id="level-uri"
            type="text"
            placeholder="e.g., ipfs://QmHashX"
            value={newLevelUri}
            onChange={(e) => setNewLevelUri(e.target.value)}
            disabled={loading}
          />
        </div>
        <button 
          onClick={addReputationLevel} 
          disabled={loading || !newLevelName || !newLevelThreshold || !newLevelUri}
        >
          Add Reputation Level
        </button>
      </div>

      {/* Modify Reputation */}
      <div className="card">
        <div className="card-title">Modify Reputation</div>
        <div className="input-group">
          <label htmlFor="target-address">Target Address:</label>
          <input
            id="target-address"
            type="text"
            placeholder="0x..."
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="rep-amount">Amount:</label>
          <input
            id="rep-amount"
            type="number"
            placeholder="e.g., 50"
            value={reputationAmount}
            onChange={(e) => setReputationAmount(e.target.value)}
            disabled={loading}
          />
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px"}}>
          <button 
            onClick={increaseReputation} 
            disabled={loading || !targetAddress || !reputationAmount}
          >
            Increase
          </button>
          <button 
            onClick={decreaseReputation} 
            disabled={loading || !targetAddress || !reputationAmount}
          >
            Decrease
          </button>
        </div>
      </div>

      {status && <div className="status" style={{gridColumn: "1 / span 2"}}>{status}</div>}
    </div>
  );
}

export default ReputationApp;

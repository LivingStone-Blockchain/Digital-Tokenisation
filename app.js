// Example JavaScript code
console.log("JavaScript is connected!");

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

// GSAP animations

// Fade-in effect for the hero section on page load
gsap.from(".hero-content", {
  opacity: 0,
  y: -50,
  duration: 1.5,
  ease: "power2.out"
});

// Staggered animation for feature cards in the Features section
gsap.from(".feature-card", {
  opacity: 0,
  y: 30,
  duration: 1,
  stagger: 0.2,
  delay: 0.5,
  ease: "power2.out"
});

// Scroll-based animation for the "How It Works" steps
gsap.from(".steps .step", {
  opacity: 0,
  y: 30,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".steps", // The element to trigger the animation
    start: "top 80%", // Animation starts when the steps section reaches 80% of the viewport height
    toggleActions: "play none none reverse" // Replay animation when scrolling back up
  }
});

// Track the current wallet connection state
let isWalletConnected = false;
let userWalletAddress = "";

// Connect Wallet logic
const connectWalletButton = document.getElementById("connect-wallet");
const walletAddressDisplay = document.getElementById("wallet-address");

connectWalletButton.addEventListener("click", async () => {
  if (!isWalletConnected) {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userWalletAddress = accounts[0];
        walletAddressDisplay.textContent = `Connected: ${userWalletAddress.slice(0, 6)}...${userWalletAddress.slice(-4)}`;
        connectWalletButton.textContent = "Disconnect Wallet";
        isWalletConnected = true;
      } catch (error) {
        console.error("User denied wallet connection", error);
      }
    } else {
      alert("Please install MetaMask or another Ethereum wallet extension to connect.");
    }
  } else {
    // Disconnect logic
    userWalletAddress = "";
    walletAddressDisplay.textContent = "";
    connectWalletButton.textContent = "Connect Wallet";
    isWalletConnected = false;
  }
});

// Send Tokens function
async function sendTokens(recipient, amount) {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenAddress = ethers.utils.getAddress("0xb81c6Ac1385FaaC61a84337e916018c730b1B9Af"); 
    const tokenAbi = [
      "function transfer(address to, uint amount) public returns (bool)"
    ];

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      console.log("Sending Tokens to:", recipient, "Amount:", amount.toString());

      const transaction = await tokenContract.transfer(recipient, amount);
      console.log("Transaction Sent:", transaction);
      await transaction.wait(); // Wait for transaction confirmation
      console.log("Transaction Confirmed:", transaction);
    } catch (error) {
      console.error("Transaction Error:", error);
    }
  } else {
    alert("MetaMask is not installed. Please install it to connect.");
  }
}


// Event listener for the send tokens button
document.getElementById("send-tokens-button").addEventListener("click", () => {
  if (isWalletConnected) {
    // Example token transfer
    const recipient = "0xDBDb47D07a6e34829e67d85cd235C9Cb3fe77DF5"; // Replace with the recipient address
    const amount = ethers.utils.parseUnits("1.0", 18); // 1 token with 18 decimal places
    sendTokens(recipient, amount);
  } else {
    alert("Please connect your wallet first.");
  }
// Display Balanceß

  async function displayBalance() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const tokenAddress = "0x02334d63758fC0634c4345521CDAeAfB9dce696A";
      const tokenAbi = [
        "function balanceOf(address owner) view returns (uint256)"
      ];
  
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
      const walletAddress = await signer.getAddress();
      const balance = await tokenContract.balanceOf(walletAddress);
  
      console.log("Wallet Balance:", ethers.utils.formatUnits(balance, 18));
    }
  }
  
});

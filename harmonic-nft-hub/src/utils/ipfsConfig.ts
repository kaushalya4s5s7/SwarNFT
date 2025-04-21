// API credentials
const PINATA_API_KEY = "8ca3955914ee685d054a";
const PINATA_API_SECRET =
  "882d4b1136f6d2776071bd7244d7bc17a2d22aa0bf9277c7cbc117ccdb617a96";
const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2N2E4ZDA2Zi0wZThmLTQyMWUtOTg3Mi0wYmQ3MDg5OTU5ZWEiLCJlbWFpbCI6ImNoYXVkaGFyaS5rYW1hbGFrYXIyMmJAaWlpdGcuYWMuaW4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGNhMzk1NTkxNGVlNjg1ZDA1NGEiLCJzY29wZWRLZXlTZWNyZXQiOiI4ODJkNGIxMTM2ZjZkMjc3NjA3MWJkNzI0NGQ3YmMxN2EyZDIyYWEwYmY5Mjc3YzdjYmMxMTdjY2RiNjE3YTk2IiwiZXhwIjoxNzc2Njk1Mzg3fQ.yX023ly5-ZpqZxf7a66SFzSCKvrH46ZRz9N6xi5D3TU"; // Your JWT token
const PINATA_API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

// Use multiple gateways for fetching
const IPFS_GATEWAYS = [
  "teal-defiant-opossum-188.mypinata.cloud",
  "https://gateway.pinata.cloud",
  "https://ipfs.io",
  "https://cloudflare-ipfs.com",
];

// Test gateway connection first
const validatePinataAccess = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      "https://api.pinata.cloud/data/testAuthentication",
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      }
    );
    return response.ok;
  } catch {
    return false;
  }
};

export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    // Validate access first
    const isValid = await validatePinataAccess();
    if (!isValid) {
      throw new Error("Invalid Pinata credentials");
    }

    const formData = new FormData();
    formData.append("file", file);

    // Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: file.type,
        size: file.size,
        uploaded: new Date().toISOString(),
      },
    });
    formData.append("pinataMetadata", metadata);

    // Add options
    const options = JSON.stringify({
      cidVersion: 0,
      wrapWithDirectory: false,
    });
    formData.append("pinataOptions", options);

    const response = await fetch(PINATA_API_URL, {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Pinata Error:", errorData);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.IpfsHash;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload to IPFS");
  }
};

// Add retry functionality with better error handling
const retry = async <T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error(`Attempt failed, remaining attempts: ${attempts - 1}`, error);
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay * 2);
  }
};

export const uploadToIPFSWithRetry = async (file: File): Promise<string> => {
  return retry(
    async () => {
      return uploadToIPFS(file);
    },
    3,
    2000
  ); // Start with 2 seconds delay
};

export const getIPFSUrl = (hash: string): string => {
  return `${IPFS_GATEWAYS[0]}/ipfs/${hash}`;
};

export const checkIPFSGateway = async (): Promise<boolean> => {
  // Use a known working hash for testing
  const TEST_HASH = "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB";

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const response = await fetch(`${gateway}/ipfs/${TEST_HASH}`, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return true;
      }
    } catch {
      continue;
    }
  }
  return false;
};

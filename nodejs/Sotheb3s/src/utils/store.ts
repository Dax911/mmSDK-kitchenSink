

export const KV_URL="redis://default:b798a1b6e736423485174e66ab1fe37b@concrete-sponge-37310.kv.vercel-storage.com:37310"
export const KV_REST_API_URL="https://concrete-sponge-37310.kv.vercel-storage.com"
export const KV_REST_API_TOKEN="AZG-ASQgODY0YjZmYTktMWQ4OS00YjM0LWFmYjktMGE1MDQ0ZmQ4ZGI1Yjc5OGExYjZlNzM2NDIzNDg1MTc0ZTY2YWIxZmUzN2I="
export const KV_REST_API_READ_ONLY_TOKEN="ApG-ASQgODY0YjZmYTktMWQ4OS00YjM0LWFmYjktMGE1MDQ0ZmQ4ZGI1v0XVv27nbSaV9r1e6sCbz5dl1FzOj7HGdvW53QREC64="
async function sendBid(bidData) {
    try {
      const response = await fetch(`${KV_REST_API_URL}/set/bidData`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        method: 'POST',
        body: JSON.stringify(bidData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
  
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export default sendBid;

  async function sendBidToStream(bidData) {
    try {
      const response = await fetch(`${KV_REST_API_URL}/set/bidData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        body: JSON.stringify([
          ["XADD", "auctionStream", "*", "bidAmount", bidData.bidAmount, "bidderAddress", bidData.bidderAddress, "timestamp", bidData.timestamp]
        ])
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  export { sendBidToStream };
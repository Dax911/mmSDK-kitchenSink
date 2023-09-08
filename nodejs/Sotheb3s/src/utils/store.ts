
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

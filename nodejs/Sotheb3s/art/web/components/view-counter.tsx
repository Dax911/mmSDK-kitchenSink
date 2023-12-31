import { kv } from '@vercel/kv'

export async function ViewCounter() {
  const views = await kv.incr('views')

  return (
    <p className="text-sm text-gray-500">
      {Intl.NumberFormat('en-us').format(views)} views
    </p>
  )
}
export async function BidViewer2() {
  const bids = await kv.json.get('bids')
  return (
    <p className="text-sm text-gray-500">
      {Intl.NumberFormat('en-us').format(bids)} bids
    </p>
  )
}

import { useEffect, useState } from 'react';

interface Bid {
  from: string;
  itemId: number;
  bidAmount: number;
  signature: string;
}

export function BidViewer() {
  const [bid, setBid] = useState<Bid | null>(null);

  const fetchLatestBid = async () => {
    try {
      console.log('fetching latest bid...');
      const response = await fetch(`${KV_REST_API_URL}/get/bidData`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }

      const responseData = await response.json();
      const data: Bid = JSON.parse(responseData.result);
    
      if (data) {
        console.log('Latest Bid:', data);
        setBid(data);
      }
    } catch (error) {
      console.error('Error fetching latest bid:', error);
    }
  };

  useEffect(() => {
    fetchLatestBid();

    // Set up a timer to fetch latest bids every 30 seconds
    const intervalId = setInterval(() => {
      fetchLatestBid();
    }, 30000);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <h1 className='m-4'>Latest Bid</h1>
      {bid ? (
        <div className="text-sm text-gray-500 outline-dashed rounded-md p-2 mb-2">
          Bidder: {bid.from} 
          <br /> 
          Amount: {Intl.NumberFormat('en-us').format(bid.bidAmount)} ETH, Item ID: {bid.itemId}
        </div>
      ) : (
        <div>No bids yet</div>
      )}
    </div>
  );
}

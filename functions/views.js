// Netlify Function: views
// Stores simple view counts in an in-memory map (dev) or AWS S3 / persisted store in production.
// This example demonstrates local development (memory) and a placeholder for S3.

const AWS = require('aws-sdk'); // optional if using S3

// For demo, use an in-memory object (will reset each function cold start in serverless)
// Production: replace with database or S3/Redis
let COUNTS = {};

exports.handler = async function(event, context) {
  const method = event.httpMethod;

  if (method === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const key = body.key;
      if (!key) return { statusCode: 400, body: 'missing key' };
      COUNTS[key] = (COUNTS[key] || 0) + 1;
      return {
        statusCode: 200,
        body: JSON.stringify({ key, views: COUNTS[key] })
      };
    } catch (e) {
      return { statusCode: 500, body: String(e) };
    }
  }

  if (method === 'GET') {
    // return top N keys and counts
    const list = Object.keys(COUNTS).map(k => ({ key: k, views: COUNTS[k] }));
    list.sort((a,b) => b.views - a.views);
    return { statusCode: 200, body: JSON.stringify(list.slice(0, 20)) };
  }

  return { statusCode: 405, body: 'method not allowed' };
};

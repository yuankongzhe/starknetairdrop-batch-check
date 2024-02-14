import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { categorizedAddresses } = req.body;
    let tokensData = {};

    for (const [prefix, addresses] of Object.entries(categorizedAddresses)) {
      const jsonPath = path.join(process.cwd(), `data/addresses_${prefix}.json`);
      const fileContents = fs.readFileSync(jsonPath, 'utf8');
      const addressesData = JSON.parse(fileContents);

      addresses.forEach((address) => {
        tokensData[address] = addressesData[address.toLowerCase()] || 'Address not found';
      });
    }

    res.status(200).json(tokensData);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
import { useState } from 'react';
import { categorizeAddresses } from '../utils/helpers';

export default function Home() {
  const [addresses, setAddresses] = useState('');
  const [tokens, setTokens] = useState({});

  const handleInputChange = (event) => {
    setAddresses(event.target.value);
  };
  async function fetchTokenData(categorizedAddresses) {
    const response = await fetch('/api/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categorizedAddresses }),
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.json();
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const addressList = addresses.split(/[ ,]+/).filter(Boolean); // 使用正则表达式按逗号或空格分割并去除空字符串
    const categorizedAddresses = categorizeAddresses(addressList); // 分类地址
    const tokensData = await fetchTokenData(categorizedAddresses); // 获取代币数据
    setTokens(tokensData);
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-white">
      <div>
      <form onSubmit={handleSubmit} className="text-center">
        <input
          type="text"
          value={addresses}
          onChange={handleInputChange}
          placeholder="逗号或空格分割地址"
          className="form-control form-control-lg mb-3" // 增加了 form-control-lg 类
        />
        <button type="submit" className="btn btn-primary btn-lg">检查空投</button> {/* Optional: Use btn-lg to enlarge the button as well */}
      </form>
        <div className="mt-3">
          {Object.entries(tokens).map(([address, tokenAmount]) => (
            <div key={address} className="token-amount">{`${address}: ${tokenAmount} tokens`}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
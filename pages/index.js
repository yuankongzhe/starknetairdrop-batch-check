import { useState } from 'react';
import { categorizeAddresses } from '../utils/helpers';
import { Analytics } from '@vercel/analytics/react';
export default function Home() {
  const [addresses, setAddresses] = useState('');
  const [tokens, setTokens] = useState({});

  const handleInputChange = (event) => {
    setAddresses(event.target.value);
  };
  function downloadAddresses() {
    // 创建包含所有地址的字符串，每个地址后面跟着一个换行符
    const addressesText = Object.keys(tokens).join('\n');
    
    // 创建一个blob对象，类型为text/plain
    const blob = new Blob([addressesText], { type: 'text/plain' });
  
    // 创建一个临时的a元素用于下载
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'addresses.txt'; // 文件名
    document.body.appendChild(a); // 附加元素到DOM以使其可以被点击
    a.click(); // 模拟点击
    document.body.removeChild(a); // 移除元素
  }
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
          style={{ width: '800px',height: '400px' }}
        />
        <button type="submit" className="btn btn-primary btn-lg">检查空投</button> {/* Optional: Use btn-lg to enlarge the button as well */}
      </form>
        <div className="mt-3">
        {Object.keys(tokens).length > 0 && (
          <button onClick={downloadAddresses} className="btn btn-secondary btn-lg mt-3">下载地址</button>
        )}
          {Object.entries(tokens).map(([address, tokenAmount]) => (
            <div key={address} className="token-amount">{`${address}: ${tokenAmount} tokens`}</div>
          ))}
          <Analytics />
        </div>
      </div>
    </div>
  );
}
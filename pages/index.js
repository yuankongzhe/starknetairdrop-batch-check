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
        <div>
          <p>          由 <a href="https://twitter.com/0xfaskety" target="_blank" rel="noopener noreferrer">
              <svg width="24" height="24" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1458"><path d="M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4 35.4-21.1 62.3-54.4 75-94-32.7 19.5-69.7 33.8-108.2 41.2C765.4 194.6 721.1 174 672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5-14.8 25.4-23.2 54.4-23.2 86.1 0 59.2 30.1 111.4 76 142.1-28-1.1-54.4-9-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4-14.3 3.7-29.6 5.8-44.9 5.8-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-0.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-0.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z" p-id="1459" fill="#000"></path></svg>
              @0xfaskety</a>  创建
          </p>
          <p>本站查询不会女巫（只可能不准），数据来源于手动下载然后分类的json文件（文件来源：<a href="https://github.com/starknet-io/provisions-data" target="_blank" rel="noopener noreferrer">
              https://github.com/starknet-io/provisions-data</a>）</p>
          <p>好玩的东西：<a href="https://docs.google.com/spreadsheets/d/1iQAR250i_QT2kWuoiQiWJPMBVnKo7SyMpcxijyWsavg/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
              STRK空投数量前1000地址</a></p>
            <p>一切以官方查询为准，本站只作为参考</p>

          
          
        </div>
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
export function categorizeAddresses(addressList) {
    return addressList.reduce((acc, address) => {
      if (address.startsWith('0x')) {
        address = address.toLowerCase();
      }
      // 取地址的前两个字符，检查是否为0x开头
      const prefix = address.startsWith('0x') ? address.slice(2, 3) : address.slice(0, 1);
      if (!acc[prefix]) {
        acc[prefix] = [];
      }
      acc[prefix].push(address);
      return acc;
    }, {});
  }
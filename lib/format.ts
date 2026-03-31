export function formatAssetPrice(asset: string, price: number): string {
  if (asset.startsWith("BTC")) {
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (asset.startsWith("ETH")) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (asset.startsWith("SOL")) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  if (asset.startsWith("BNB")) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  return price.toLocaleString("en-US");
}

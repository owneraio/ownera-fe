import { Observable, interval, from, map } from 'rxjs';

interface Asset {
  id: number;
  assetName: string;
  assetType: 'Stock' | 'Currency';
  price: number;
  lastUpdate: number;
}

const createAsset = ({ id, assetType }: Pick<Asset, 'id'| 'assetType'>): Asset => ({
  id,
  assetType,
  assetName: assetType === 'Stock'
    ? ['AAPL','GOOGL','FB', 'TSLA', 'MSFT'][Math.floor(Math.random() * 4)]
    : ['EUR','USD','GBP', 'NIS', 'JPY'][Math.floor(Math.random() * 4)],
  price: Math.random()*10,
  lastUpdate: Date.now(),
});

const getAllAssets = (n: number): Asset[] => {
  const result: Asset[] = [];
  for (let i = 0; i < n; i++) {
    result.push(createAsset({ id: i, assetType: 'Stock'}));
    result.push(createAsset({ id: i+n, assetType: 'Currency'}));
  }
  return result;
}

const assets = getAllAssets(200);

const timeObservable = interval(1000);

export const dataSource = new Observable((ob) => {
  timeObservable.subscribe(() => {
    from(assets)
      .pipe(
        map(val => {
          const random = Math.random();
          val.price = random >= 0.5 ? val.price + random : val.price - random;
          val.lastUpdate = Date.now();
          return val;
        })
      )
      .subscribe(val => ob.next(val));
  });
  return () => null;
});

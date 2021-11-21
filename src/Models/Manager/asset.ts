export class asset {
    id:            number;
    symbol:        string;
    shares:        number = 0;
    avgprice:      number = 0;
    sharesSold:    number= 0;
    avgpriceSold:  number= 0;
    originalMoney: number= 0;
    totalMoneyIn:  number= 0;
    totalMoneyOut: number= 0;
    price:         number= 0;
    currentTotal:  number= 0;
    realProfit:    number= 0;
    realMargin:    number= 0;
    unRealProfit:  number= 0;
    unRealMargin:  number= 0;
    assettype:     any;
    ownerid:       number;
    country:       string;
}

export class mockAsset {
    id:            string;
    symbol:        string;
    shares:        string ;
    avgprice:      string ;
    sharesSold:    string;
    avgpriceSold:  string;
    originalMoney: string;
    totalMoneyIn:  string;
    totalMoneyOut: string;
    price:         string;
    currentTotal:  string;
    realProfit:    string;
    realMargin:    string;
    unRealProfit:  string;
    unRealMargin:  string;
    assettype:     any;
    ownerid:       string;
    country:       string;
}


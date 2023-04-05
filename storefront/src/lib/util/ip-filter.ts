function ipfilter(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        // Make an HTTP request to fetch users
        fetch('https://api.ipify.org/?format=json')
            .then(response => {
                // If the response status is not ok, reject the promise with an error
                if (!response.ok) {
                    throw new Error('Failed to fetch users')
                }
                // If the response status is ok, parse the JSON response and resolve the promise with the result
                return response.json()
            })
            .then(data => resolve(data.ip))
            .catch(error => reject(error))
    })
}

export default ipfilter;
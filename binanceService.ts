async getPrices(symbol: string): Promise<any> {
  try {
    const response = await this.makeRequest({
      method: 'GET',
      path: '/api/v3/ticker/price',
      params: {
        symbol: symbol.toUpperCase()
      },
      isPublic: true
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des prix:', error);
    throw error;
  }
}

private async makeRequest({ method, path, params = {}, isPublic = false }) {
  try {
    let queryString = '';
    let url = '';

    if (isPublic) {
      queryString = new URLSearchParams(params).toString();
      url = `${this.baseUrl}${path}${queryString ? `?${queryString}` : ''}`;
    } else {
      const timestamp = Date.now();
      queryString = new URLSearchParams({
        ...params,
        timestamp: timestamp.toString()
      }).toString();

      const signature = this.generateSignature(queryString);
      url = `${this.baseUrl}${path}?${queryString}&signature=${signature}`;
    }

    console.log('Request URL:', url);

    const headers: any = {};
    if (!isPublic) {
      headers['X-MBX-APIKEY'] = this.apiKey;
    }

    return await axios({
      method,
      url,
      headers
    });
  } catch (error) {
    console.error('makeRequest error:', error);
    throw error;
  }
} 
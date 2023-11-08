// Created By: Ian Wilson
// Date: November 7th, 2023
class coreHTTP {
  /* <<< HTTP GET request >>> */
  async get(url) {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    const response = await fetch(`http://localhost:3000${url}`, requestOptions);
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return Promise.reject(response.status);
    }
  }
  
  /* <<< HTTP POST request >>> */
  async post(url, requestData) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData)
    };
    const response = await fetch(`http://localhost:3000${url}`, requestOptions);
    // The 'ok' property of the response will be true if the status is 200-299
    return response; // Return the response object itself for further checking in WriteList
  }
  
  /* <<< HTTP PUT request >>> */
  async put(url, requestData) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData)
    };
    const response = await fetch(`http://localhost:3000${url}`, requestOptions);
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return Promise.reject(response.status);
    }
  }

  async delete(url) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    };
    const response = await fetch(`http://localhost:3000${url}`, requestOptions);
    return response;
  }

  /* <<< HTTP PATCH request >>> */
  async patch(url, requestData) {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData)
    };
    const response = await fetch(`http://localhost:3000${url}`, requestOptions);
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return Promise.reject(response.status);
    }
  }
}
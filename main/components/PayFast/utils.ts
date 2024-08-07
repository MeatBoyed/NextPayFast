/**
 * Generates the PayFast Parameter string from the provided Form/Payload body object.
 * Passed Data must be in the correct order per PayFast's API spec.
 * @param data The Transaction/Payload to be encoded
 * @returns PayFast structured parameter string
 */
export function generateParameter(data: any) {
  // Create parameter string
  let output = "";
  for (let key in data) {
    if (data.hasOwnProperty(key) && key !== "signature") {
      const value = data[key as keyof typeof data] || undefined;
      if (value) output += `${key}=${encodeURIComponent(value.toString().trim()).replace(/%20/g, "+")}&`;
    }
  }

  // Remove last ampersand
  const getString = output.slice(0, -1);

  return getString;
}

export function generateResponseParameter(data: any) {
  let pfParamString = "";
  for (let key in data) {
    if (data.hasOwnProperty(key) && key !== "signature") {
      pfParamString += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
    }
  }
  pfParamString = pfParamString.slice(0, -1);
  return pfParamString;
}

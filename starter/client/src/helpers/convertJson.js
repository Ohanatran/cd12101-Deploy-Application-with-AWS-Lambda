export function convertDynamoDBResponseToJSON(Items) {
  return {
    items: Items.map((item) => {
      const jsonItem = {}
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          const attribute = item[key]
          const attributeName = key

          // Extract the type (S, N, BOOL, etc.)
          const type = Object.keys(attribute)[0]
          const value = attribute[type]

          // Convert DynamoDB attribute to a simple JSON property
          jsonItem[attributeName] = convertDynamoDBAttributeToJSON(type, value)
        }
      }
      return jsonItem
    })
  }
}

function convertDynamoDBAttributeToJSON(type, value) {
  switch (type) {
    case 'S': // String
    case 'N': // Number
      return value
    case 'BOOL': // Boolean
      return value === true
    default:
      return null // Unsupported type
  }
}

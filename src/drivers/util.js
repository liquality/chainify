export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export const renameKey = (object, oldKey, newKey) => {
  object[newKey] = object[oldKey]
  delete object[oldKey]
  return object
}

export function createMapSafely(createMap) {
  try {
    return { map: createMap(), error: null };
  } catch (error) {
    return { map: null, error };
  }
}

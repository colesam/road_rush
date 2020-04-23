export default {
  /**
   * Get a random element from the array
   */
  getRandom: <T>(arr: Array<T>): T => {
    const index = Math.floor(Math.random() * 10) % arr.length;
    return arr[index];
  },

  /**
   * Return elements of array a that are also found in array b
   */
  intersect: <T>(a: Array<T>, b: Array<T>): Array<T> => {
    return a.filter((elem) => b.includes(elem));
  },
};

const shuffle = require("../src/shuffle");

describe("shuffle should contain all the same items as length as the input array", () => {
  // CODE HERE
  const inputArray = ['a', 'b', 'c', 'd', 'e'];
  const result = shuffle(inputArray);
  
  //check that it returns an array of the same length as the argument sent in
  test('', () => {
    expect(result.length).toBe(inputArray.length)
  });

  test('should have its elements shuffled', () => {
  //check that the items have been shuffled around
    expect(result).not.toEqual(inputArray);
  });

});


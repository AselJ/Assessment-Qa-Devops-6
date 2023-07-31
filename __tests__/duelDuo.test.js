const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.SAFARI).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"),1000)
  });

  test("clicking the Draw button displays the div with id = 'choices'", async () => {
    await driver.get("http://localhost:8000");
    await driver.findElement(By.id('draw')).click();
    const choicesDiv = await driver.findElement(By.id("choices")).isDisplayed();
    expect(choicesDiv).toBeTruthy();
  });

  test('when a bot is "Removed from Duo" it goes back to "choices"', async() => {
    await driver.get("http://localhost:8000");
    await driver.findElement(By.id('draw')).click();
    // get initial child element count, should be 5
    const initialChildElementCount = await driver.findElements(By.css('#choices .bot-card'));
    // click add to duo, and remove from list. 
    await driver.findElement(By.className("bot-btn")).click();
    // get after removal child element count, should be 4
    const afterRemoveChildElementCount = await driver.findElements(By.css('#choices .bot-card'));
    // test if element was removed and count reduced.
    expect(initialChildElementCount.length).toBeGreaterThan(afterRemoveChildElementCount.length);
    // click button to remove from duo. 
    await driver.findElement(By.css('#player-duo .bot-card .bot-btn')).click();
    // check if element added back to initial container.
    const elementBackChildElementCount = await driver.findElements(By.css('#choices .bot-card'));
    // test if element is added back. 
    expect(initialChildElementCount.length).toEqual(elementBackChildElementCount.length);

  });

});
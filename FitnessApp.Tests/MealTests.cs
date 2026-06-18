using System;
using System.IO;
using System.Linq;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace FitnessApp.Tests
{
    public class MealTests
    {
[Fact]
public void TestAddMeal()
{
    var driverVersion = "148.0.7778.168";
    var driverDir = Path.GetFullPath(Path.Combine(
        AppContext.BaseDirectory,
        "..", "..", "..", "..", "..",
        "tools", "chromedriver", driverVersion,
        "chromedriver-win64", "chromedriver-win64"));

    var options = new ChromeOptions();
    options.AddArgument("--headless");
    options.AddArgument("--no-sandbox");
    options.AddArgument("--disable-dev-shm-usage");
    options.AddArgument("--disable-gpu");
    options.AddArgument("--window-size=1920,1080");

    IWebDriver driver = new ChromeDriver(driverDir, options);
    var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));

    try
    {
        driver.Navigate().GoToUrl("http://localhost:5173/login");

        wait.Until(d => d.FindElement(By.Id("email")).Displayed);
        driver.FindElement(By.Id("email")).SendKeys("user@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("Triumf12.");
        driver.FindElement(By.Id("login-button")).Click();

        wait.Until(d => !d.Url.Contains("/login"));

        driver.Navigate().GoToUrl("http://localhost:5173/user/meals");

        wait.Until(d => d.FindElement(By.Id("addmeal-button")).Displayed);
        driver.FindElement(By.Id("addmeal-button")).Click();

        var mealName = wait.Until(d =>
        {
            var el = d.FindElements(By.Id("meal-name")).FirstOrDefault();
            return el != null && el.Displayed && el.Enabled ? el : null;
        });
        mealName.SendKeys("Breakfast");
        driver.FindElement(By.Id("save-meal")).Click();

        var mealCard = wait.Until(d =>
        {
            try
            {
                var cards = d.FindElements(By.CssSelector(".card"));
                return cards.FirstOrDefault(c => c.Text.Contains("Breakfast"));
            }
            catch (StaleElementReferenceException) { return null; }
        });

        Assert.NotNull(mealCard);
    }
    finally
    {
        driver.Quit();
    }
}
}
}
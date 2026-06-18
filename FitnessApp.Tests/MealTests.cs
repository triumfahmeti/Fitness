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
        "..", "..", "..",
        "tools", "chromedriver", driverVersion,
        "chromedriver-win64"));

    var options = new ChromeOptions();
   // options.AddArgument("--headless");
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

        // Pastro localStorage
        ((IJavaScriptExecutor)driver).ExecuteScript("window.localStorage.clear();");
        driver.Navigate().Refresh();

        wait.Until(d => d.FindElement(By.Id("email")).Displayed);

        var emailInput = driver.FindElement(By.Id("email"));
        emailInput.Clear();
        emailInput.SendKeys("user@gmail.com");

        var passwordInput = driver.FindElement(By.Id("password"));
        passwordInput.Clear();
        passwordInput.SendKeys("User12.");

        driver.FindElement(By.Id("login-button")).Click();

        // Prit login të mbarojë
        wait.Until(d => !d.Url.Contains("/login"));

        // Shko te meals
        driver.Navigate().GoToUrl("http://localhost:5173/user/meals");

        // Klik Add Meal
        wait.Until(d => d.FindElement(By.Id("addmeal-button")).Displayed);
        driver.FindElement(By.Id("addmeal-button")).Click();

        // Mbush emrin e meal-it
        var mealName = wait.Until(d =>
        {
            var el = d.FindElements(By.Id("meal-name")).FirstOrDefault();
            return el != null && el.Displayed && el.Enabled ? el : null;
        });

        var uniqueName = "Breakfast Test " + DateTime.Now.Ticks;
        mealName.SendKeys(uniqueName);

        // Klik Save Meal
        driver.FindElement(By.Id("save-meal")).Click();

        // Prit derisa URL të ndryshojë (qoftë te food page ose mbetet te meals)
        wait.Until(d =>
        {
            // Verifikim: ose URL ndryshoi te food page (sukses), 
            // ose ende te /meals (sukses gjithashtu)
            var currentUrl = d.Url;
            return currentUrl.Contains("/user/meals") || 
                   currentUrl.Contains("/user/foods") || 
                   currentUrl.Contains("/food");
        });

        // Verifiko që meal u krijua duke u kthyer te /meals
        driver.Navigate().GoToUrl("http://localhost:5173/user/meals");

        // Prit dhe kërko meal me emrin që krijuam
        var mealCard = wait.Until(d =>
        {
            try
            {
                var cards = d.FindElements(By.CssSelector(".card"));
                return cards.FirstOrDefault(c => c.Text.Contains(uniqueName));
            }
            catch (StaleElementReferenceException) { return null; }
        });

        Assert.NotNull(mealCard);
    }
    finally
    {
        driver.Quit();
    }
}}
}
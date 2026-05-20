using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace FitnessApp.Tests;

public class UnitTest1
{
    [Fact]
    public void TestDeleteWorkout()
    {
        var driverVersion = "148.0.7778.168";
        var driverDir = Path.GetFullPath(Path.Combine(
            AppContext.BaseDirectory,
            "..",
            "..",
            "..",
            "tools",
            "chromedriver",
            driverVersion,
            "chromedriver-win64"));
        IWebDriver driver = new ChromeDriver(driverDir);

        driver.Navigate().GoToUrl("http://localhost:5173/login");

        driver.FindElement(By.Id("email")).SendKeys("user@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("Triumf12.");
        driver.FindElement(By.Id("login-button")).Click();
        Thread.Sleep(2000);
        driver.Navigate().GoToUrl("http://localhost:5173/user/workouts");

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));


        var workoutCard = wait.Until(d =>
        {
            try
            {
                var cards = d.FindElements(By.CssSelector(".card"));
                return cards.FirstOrDefault(c => c.Text.Contains("Morning Run"));
            }
            catch (StaleElementReferenceException)
            {
                return null;
            }
        });

        driver.FindElement(By.Id("deleteworkout-button")).Click();
        wait.Until(d => driver.FindElement(By.Id("deleteworkout-modal"))).Click();




        driver.Quit();

    }
}
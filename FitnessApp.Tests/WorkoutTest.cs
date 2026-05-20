using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace FitnessApp.Tests
{
    public class WorkoutTest
    {
        [Fact]
        public void TestAddWorkout()
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
            driver.FindElement(By.Id("password")).SendKeys("User12.");
            driver.FindElement(By.Id("login-button")).Click();
            Thread.Sleep(2000);
            driver.Navigate().GoToUrl("http://localhost:5173/user/workouts");
            driver.FindElement(By.Id("addworkout-button")).Click();
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            var workoutName = wait.Until(d =>
            {
                var el = d.FindElements(By.Id("workout-name")).FirstOrDefault();
                return el != null && el.Displayed && el.Enabled ? el : null;
            });
            workoutName.SendKeys("Morning Run");
            driver.FindElement(By.Id("save-workout")).Click();

            var workoutCard = wait.Until(d =>
    {
        try
        {
            return d.FindElement(By.XPath("//section//div[contains(@class,'card')]//h5[contains(@class,'card-title') and contains(.,'Morning Run')]/ancestor::div[contains(@class,'card')]"));
        }
        catch (StaleElementReferenceException)
        {
            return null;
        }
    });

            Assert.NotNull(workoutCard);

            driver.Quit();
        }
    }
}
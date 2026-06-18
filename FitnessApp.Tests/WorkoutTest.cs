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
    public class WorkoutTest
    {
        [Fact]
        public void TestAddWorkout()
        {
            var driverVersion = "148.0.7778.168";
            var driverDir = Path.GetFullPath(Path.Combine(
                AppContext.BaseDirectory,
                "..", "..", "..",
                "tools", "chromedriver", driverVersion,
                "chromedriver-win64"));

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

                wait.Until(d => !d.Url.Contains("/login"));

                // Shko te workouts
                driver.Navigate().GoToUrl("http://localhost:5173/user/workouts");

                wait.Until(d => d.FindElement(By.Id("addworkout-button")).Displayed);
                driver.FindElement(By.Id("addworkout-button")).Click();

                var workoutName = wait.Until(d =>
                {
                    var el = d.FindElements(By.Id("workout-name")).FirstOrDefault();
                    return el != null && el.Displayed && el.Enabled ? el : null;
                });

                var uniqueName = "Morning Run " + DateTime.Now.Ticks;
                workoutName.SendKeys(uniqueName);
                driver.FindElement(By.Id("save-workout")).Click();

                // Pas Save, aplikacioni navigon ose te exercises ose te workouts
                wait.Until(d =>
                {
                    var currentUrl = d.Url;
                    return currentUrl.Contains("/user/workouts") ||
                           currentUrl.Contains("/user/exercises") ||
                           currentUrl.Contains("/exercise");
                });

                // Kthehemi te /workouts për verifikim
                driver.Navigate().GoToUrl("http://localhost:5173/user/workouts");

                var workoutCard = wait.Until(d =>
                {
                    try
                    {
                        var cards = d.FindElements(By.CssSelector(".card"));
                        return cards.FirstOrDefault(c => c.Text.Contains(uniqueName));
                    }
                    catch (StaleElementReferenceException) { return null; }
                });

                Assert.NotNull(workoutCard);
            }
            finally
            {
                driver.Quit();
            }
        }
    }
}
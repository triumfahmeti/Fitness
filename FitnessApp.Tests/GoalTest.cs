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
    public class GoalTest
    {
        [Fact]
        public void AddGoal()
        {
            var driverVersion = "148.0.7778.168";
            var driverDir = Path.GetFullPath(Path.Combine(
                AppContext.BaseDirectory,
                "..", "..", "..",
                "tools", "chromedriver", driverVersion,
                "chromedriver-win64"));

            IWebDriver driver = new ChromeDriver(driverDir);
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));

            try
            {
                // LOGIN
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

                // Navigon te Goal Progress
                driver.Navigate().GoToUrl("http://localhost:5173/user/goal-progress");

                // Gjej select element (provo disa selectors)
                var selectElement = wait.Until(d =>
                {
                    try
                    {
                        var byCss = d.FindElements(By.CssSelector("select.form-control.form-control-lg.mb-3")).FirstOrDefault();
                        if (byCss != null && byCss.Displayed) return byCss;

                        return d.FindElements(By.TagName("select")).FirstOrDefault(s => s.Displayed);
                    }
                    catch (StaleElementReferenceException) { return null; }
                });

                Assert.NotNull(selectElement);

                var select = new SelectElement(selectElement);
                select.SelectByValue("GAIN_WEIGHT");

                // Mbushe target weight
                var targetWeight = wait.Until(d => d.FindElement(By.Id("target-weight")));
                targetWeight.Clear();
                targetWeight.SendKeys("80");

                // Klik Save Goal
                driver.FindElement(By.Id("save-goal")).Click();

                // Verifiko mesazhin
                var success = wait.Until(d => d.FindElement(By.Id("successgoal-message")));
                Assert.Contains("Goal saved successfully", success.Text);
            }
            finally
            {
                driver.Quit();
            }
        }
    }
}
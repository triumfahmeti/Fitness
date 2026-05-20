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
    public class GoalTest
    {
        [Fact]
        public void AddGoal()
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
            driver.Navigate().GoToUrl("http://localhost:5173/user/goal-progress");
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));
            var select = new SelectElement(
                wait.Until(d => d.FindElement(By.CssSelector("select.form-control.form-control-lg.mb-3")))
            );
            select.SelectByValue("GAIN_WEIGHT");
            driver.FindElement(By.Id("target-weight")).SendKeys("80");

            driver.FindElement(By.Id("save-goal")).Click();



            var success = wait.Until(d => d.FindElement(By.Id("successgoal-message")));

            Assert.Contains("Goal saved successfully.", success.Text);


            driver.Quit();

        }
    }
}
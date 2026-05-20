using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace FitnessApp.Tests
{
    public class LoginTests
    {
        // [Fact]

        // public void TestLoginWithValidCredentials()
        // {
        //     // hap browser
        //     var driverVersion = "148.0.7778.168";
        //     var driverDir = Path.GetFullPath(Path.Combine(
        //         AppContext.BaseDirectory,
        //         "..",
        //         "..",
        //         "..",
        //         "tools",
        //         "chromedriver",
        //         driverVersion,
        //         "chromedriver-win64"));
        //     IWebDriver driver = new ChromeDriver(driverDir);

        //     // shko te aplikacioni yt
        //     driver.Navigate().GoToUrl("http://localhost:5173/login");

        //     // gjej inputet
        //     driver.FindElement(By.Id("email")).SendKeys("user@gmail.com");
        //     driver.FindElement(By.Id("password")).SendKeys("User12.");

        //     // klik login
        //     driver.FindElement(By.Id("login-button")).Click();

        //     // prit pak (important)
        //     System.Threading.Thread.Sleep(2000);

        //     // verifiko URL
        //     Assert.Contains("profile", driver.Url);

        //     // mbyll browser
        //     driver.Quit();
        // }

        [Fact]
        public void TestLoginWithInvalidCredentials()
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

            // gjej inputet
            driver.FindElement(By.Id("email")).SendKeys("invalid@gmail.com");
            driver.FindElement(By.Id("password")).SendKeys("Invalid123.");


            driver.FindElement(By.Id("login-button")).Click();

            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));

            var error = wait.Until(d => d.FindElement(By.Id("login-error")));

            Assert.Contains("Invalid credentials", error.Text);

            // mbyll browser
            driver.Quit();
        }
    }
}
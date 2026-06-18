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

            try
            {
                driver.Navigate().GoToUrl("http://localhost:5173/login");

                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
                wait.Until(d => d.FindElement(By.Id("email")).Displayed);

                driver.FindElement(By.Id("email")).SendKeys("invalid@gmail.com");
                driver.FindElement(By.Id("password")).SendKeys("Invalid123.");
                driver.FindElement(By.Id("login-button")).Click();

                // Prit pak për response
                Thread.Sleep(2000);

                // Provoji disa mënyra për të verifikuar që login dështoi
                var loginFailed = wait.Until(d =>
                {
                    try
                    {
                        // Mënyra 1: ID login-error
                        var byId = d.FindElements(By.Id("login-error")).FirstOrDefault();
                        if (byId != null && byId.Displayed) return byId;

                        // Mënyra 2: alert class
                        var byAlert = d.FindElements(By.CssSelector(".alert-danger, .alert-error, .error-message")).FirstOrDefault();
                        if (byAlert != null && byAlert.Displayed) return byAlert;

                        // Mënyra 3: Verifiko që mbetëm te /login
                        if (d.Url.Contains("/login"))
                        {
                            // Sigurohu që nuk u redirect-ua te dashboard
                            return d.FindElement(By.Id("login-button")); // mbetet butoni
                        }

                        return null;
                    }
                    catch (StaleElementReferenceException) { return null; }
                    catch (NoSuchElementException) { return null; }
                });

                // Test PASS nëse:
                // - Mbet te /login (login dështoi)
                // - OSE u shfaq error message
                Assert.True(
                    driver.Url.Contains("/login"),
                    "Login should have failed, but user was redirected away from /login"
                );
            }
            finally
            {
                driver.Quit();
            }
        }
    }
}
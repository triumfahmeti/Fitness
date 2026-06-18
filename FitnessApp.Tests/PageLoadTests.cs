using System;
using System.IO;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace FitnessApp.Tests
{
    public class PageLoadTests
    {
        private static IWebDriver CreateDriver()
        {
            var driverVersion = Environment.GetEnvironmentVariable("CHROMEDRIVER_VERSION") ?? "148.0.7778.168";
            var driverDir = Path.GetFullPath(Path.Combine(
                AppContext.BaseDirectory,
                "..",
                "..",
                "..",
                "tools",
                "chromedriver",
                driverVersion,
                "chromedriver-win64"));

            var options = new ChromeOptions();
            options.AddArgument("--headless=new");
            options.AddArgument("--no-sandbox");
            options.AddArgument("--disable-dev-shm-usage");
            options.AddArgument("--window-size=1920,1080");
            options.AddArgument("--ignore-certificate-errors");
            options.AddArgument("--allow-insecure-localhost");

            return new ChromeDriver(driverDir, options);
        }

        [Fact]
        public void TestLoginPageLoads()
        {
            IWebDriver driver = CreateDriver();
            try
            {
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

                // Shko në /login page
                driver.Navigate().GoToUrl("http://localhost:5173/login");

                // Verifiko që elementet kryesore ekzistojnë
                var emailInput = wait.Until(d => d.FindElement(By.Id("email")));
                Assert.NotNull(emailInput);
                Assert.True(emailInput.Displayed, "Email input should be visible");

                var passwordInput = driver.FindElement(By.Id("password"));
                Assert.NotNull(passwordInput);
                Assert.True(passwordInput.Displayed, "Password input should be visible");

                var loginButton = driver.FindElement(By.Id("login-button"));
                Assert.NotNull(loginButton);
                Assert.True(loginButton.Displayed, "Login button should be visible");
                Assert.True(loginButton.Enabled, "Login button should be enabled");
            }
            finally
            {
                driver.Quit();
            }
        }

        [Fact]
        public void TestRegisterPageLoads()
        {
            IWebDriver driver = CreateDriver();
            try
            {
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

                // Shko në /register page
                driver.Navigate().GoToUrl("http://localhost:5173/register");

                // Verifiko që elementet kryesore ekzistojnë
                var nameInput = wait.Until(d => d.FindElement(By.Id("name")));
                Assert.NotNull(nameInput);
                Assert.True(nameInput.Displayed, "Name input should be visible");

                var emailInput = driver.FindElement(By.Id("email"));
                Assert.NotNull(emailInput);
                Assert.True(emailInput.Displayed, "Email input should be visible");

                var passwordInput = driver.FindElement(By.Id("password"));
                Assert.NotNull(passwordInput);
                Assert.True(passwordInput.Displayed, "Password input should be visible");

                var registerButton = driver.FindElement(By.Id("register-button"));
                Assert.NotNull(registerButton);
                Assert.True(registerButton.Displayed, "Register button should be visible");
                Assert.True(registerButton.Enabled, "Register button should be enabled");
            }
            finally
            {
                driver.Quit();
            }
        }
    }
}
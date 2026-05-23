using System;
using System.Linq;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace FitnessApp.Tests
{
    public class AdminDashboardTest
    {
        private WebDriverWait _wait = null!;
        [Fact]
        public void TestAdminDashboardAccess()
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
            var options = new ChromeOptions();

            options.AddArgument("--headless=new");
            options.AddArgument("--no-sandbox");
            options.AddArgument("--disable-dev-shm-usage");
            options.AddArgument("--window-size=1920,1080");
            options.AddArgument("--ignore-certificate-errors");
            options.AddArgument("--allow-insecure-localhost");

            IWebDriver driver = new ChromeDriver(driverDir, options);
            try
            {
                _wait = new WebDriverWait(driver, TimeSpan.FromSeconds(20));

                driver.Navigate().GoToUrl("http://127.0.0.1:5173/login");
                driver.FindElement(By.Id("email")).SendKeys("admin1@gmail.com");
                driver.FindElement(By.Id("password")).SendKeys("Admin12.");
                driver.FindElement(By.Id("login-button")).Click();

                _wait.Until(d =>
                {
                    var hasLoginError = d.FindElements(By.Id("login-error")).Any();
                    if (hasLoginError)
                    {
                        return true;
                    }

                    var hasAdminUrl = d.Url.Contains("/admin", StringComparison.OrdinalIgnoreCase);
                    if (hasAdminUrl)
                    {
                        return true;
                    }

                    var token = (string?)((IJavaScriptExecutor)d).ExecuteScript("return window.localStorage.getItem('accessToken');");
                    return !string.IsNullOrWhiteSpace(token);
                });

                if (driver.FindElements(By.Id("login-error")).Any())
                {
                    var errorText = driver.FindElement(By.Id("login-error")).Text;

                    Console.WriteLine("===== PAGE BODY =====");

                    var body = driver.FindElement(By.TagName("body")).Text;
                    Console.WriteLine(body);

                    Console.WriteLine("===== CURRENT URL =====");
                    Console.WriteLine(driver.Url);

                    Console.WriteLine("===== PAGE SOURCE =====");
                    Console.WriteLine(driver.PageSource);

                    Assert.Fail($"Login failed before dashboard assertions. UI error: {errorText}");
                }

                driver.Navigate().GoToUrl("http://127.0.0.1:5173/admin");
                _wait.Until(d => !d.PageSource.Contains("Loading..."));

                // titulli
                Assert.True(
                    _wait.Until(d => d.FindElements(By.XPath("//h2[normalize-space()='Dashboard']")).Any()),
                    "Dashboard title was not found."
                );

                // Total Users karta
                Assert.True(
                    _wait.Until(d => d.FindElements(By.XPath("//div[contains(@class,'card-body')]//*[normalize-space()='Total Users']")).Any()),
                    "Total Users card was not found."
                );

                // Kartat e grafikave
                AssertCardHasChartCanvas("Age Distribution");
                AssertCardHasChartCanvas("Gender Distribution");
                AssertCardHasChartCanvas("Top 5 Exercises");
                AssertCardHasChartCanvas("Top 5 Foods");
            }
            finally
            {
                driver.Quit();
            }

        }

        private void AssertCardHasChartCanvas(string cardTitle)
        {
            var card = _wait.Until(d =>
            {
                try
                {
                    return d.FindElements(By.XPath($"//div[contains(@class,'card')]//h5[normalize-space()='{cardTitle}']/ancestor::div[contains(@class,'card')]"))
                            .FirstOrDefault();
                }
                catch (StaleElementReferenceException)
                {
                    return null;
                }
            });

            Assert.NotNull(card);

            var canvas = card.FindElements(By.TagName("canvas")).FirstOrDefault();
            Assert.NotNull(canvas);
        }
    }
}
using System;
using System.Linq;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace FitnessApp.Tests
{
    public class AdminDashboardTest
    {
        private WebDriverWait _wait;
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
            IWebDriver driver = new ChromeDriver(driverDir);
            try
            {
                _wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

                driver.Navigate().GoToUrl("http://localhost:5173/login");

                driver.FindElement(By.Id("email")).SendKeys("admin1@gmail.com");
                driver.FindElement(By.Id("password")).SendKeys("Admin12.");
                driver.FindElement(By.Id("login-button")).Click();
                Thread.Sleep(2000);
                driver.Navigate().GoToUrl("http://localhost:5173/admin");

                _wait.Until(d => !d.PageSource.Contains("Loading..."));

                // titulli
                Assert.True(driver.FindElements(By.XPath("//h2[normalize-space()='Dashboard']")).Any());

                // Total Users karta
                Assert.True(driver.FindElements(By.XPath("//div[contains(@class,'card-body')]//*[normalize-space()='Total Users']")).Any());

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
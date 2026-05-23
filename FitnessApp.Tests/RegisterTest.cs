using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace FitnessApp.Tests
{
    public class RegisterTest
    {
        [Fact]
        public void RegisterWithValidCredentials()
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


            driver.Navigate().GoToUrl("http://localhost:5173/register");

            // gjej inputet
            driver.FindElement(By.Id("name")).SendKeys("TestName");
            driver.FindElement(By.Id("surname")).SendKeys("TestSurname");
            //driver.FindElement(By.Id("email")).SendKeys("test@gmail.com");
            driver.FindElement(By.Id("email")).SendKeys($"test{DateTime.Now.Ticks}@gmail.com");
            SetDateValue(driver, "birthday", new DateTime(1995, 5, 17));
            driver.FindElement(By.Id("gender")).SendKeys("Male");
            driver.FindElement(By.Id("password")).SendKeys("Test12.");
            driver.FindElement(By.Id("role")).SendKeys("Client");

            driver.FindElement(By.Id("register-button")).Click();

            Thread.Sleep(2000);

            Assert.Contains("profile", driver.Url);


            // mbyll browser
            driver.Quit();
        }

        private static void SetDateValue(IWebDriver driver, string id, DateTime date)
        {
            var input = driver.FindElement(By.Id(id));
            var value = date.ToString("yyyy-MM-dd");

            if (string.Equals(input.GetAttribute("type"), "date", StringComparison.OrdinalIgnoreCase))
            {
                var js = (IJavaScriptExecutor)driver;
                js.ExecuteScript(
                    "const el = arguments[0];" +
                    "const val = arguments[1];" +
                    "const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;" +
                    "setter.call(el, val);" +
                    "el.dispatchEvent(new Event('input', { bubbles: true }));" +
                    "el.dispatchEvent(new Event('change', { bubbles: true }));",
                    input,
                    value);
                return;
            }

            input.Clear();
            input.SendKeys(value);
        }
    }
}
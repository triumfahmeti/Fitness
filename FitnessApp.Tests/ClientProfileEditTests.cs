using System;
using System.IO;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

public class ClientProfileEditTests : IDisposable
{
    private readonly IWebDriver _driver;
    private readonly WebDriverWait _wait;

    // Update this to your frontend base URL (e.g., http://localhost:5173)
    private const string BaseUrl = "http://localhost:5173";

    public ClientProfileEditTests()
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
        _driver = new ChromeDriver(driverDir);
        _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
    }

    [Fact]
    public void EditProfile_UpdatesFieldsAndSaves()

    {
        _driver.Navigate().GoToUrl("http://localhost:5173/login");
        _driver.FindElement(By.Id("email")).SendKeys("user@gmail.com");
        _driver.FindElement(By.Id("password")).SendKeys("Triumf12.");
        _driver.FindElement(By.Id("login-button")).Click();
        Thread.Sleep(2000);
        // Navigate to the client profile page
        _driver.Navigate().GoToUrl($"{BaseUrl}/user/profile");

        // Wait for page to load (Edit Profile button visible)
        var editButton = _wait.Until(d =>
        {
            var el = d.FindElement(By.CssSelector("button.btn.btn-primary.btn-sm"));
            return el.Displayed ? el : null;
        });

        editButton.Click();

        // Update fields
        SetInputValue("name", "TestName");
        SetInputValue("surname", "TestSurname");
        SetInputValue("email", "user@gmail.com");
        SetDateValue("birthday", new DateTime(1995, 5, 17));
        SelectByValue("gender", "Male");
        SetInputValue("weight", "72.5");
        SetInputValue("height", "178.2");
        SelectByValue("activityLevel", "2");

        // Save
        var saveButton = _driver.FindElement(By.XPath("//button[contains(.,'Save')]"));
        saveButton.Click();

        // Wait for Save button to disappear (editing ends)
        _wait.Until(d =>
        {
            var buttons = d.FindElements(By.XPath("//button[contains(.,'Save')]"));
            return buttons.Count == 0;
        });

        // Verify read-only fields reflect saved values
        Assert.Equal("TestName", GetInputValue("name"));
        Assert.Equal("TestSurname", GetInputValue("surname"));
        Assert.Equal("user@gmail.com", GetInputValue("email"));
        Assert.Equal("Male", GetInputValue("gender"));
        Assert.Equal("72.5", GetInputValue("weight"));
        Assert.Equal("178.2", GetInputValue("height"));
        Assert.Equal("Moderately Active", GetInputValue("activityLevel"));
    }

    private void SetInputValue(string name, string value)
    {
        var input = WaitForInput(name);
        input.Clear();
        input.SendKeys(value);
    }

    private void SelectByValue(string name, string value)
    {
        var select = new SelectElement(WaitForSelect(name));
        select.SelectByValue(value);
    }

    private void SetDateValue(string name, DateTime date)
    {
        var input = WaitForInput(name);
        var value = date.ToString("yyyy-MM-dd");

        if (string.Equals(input.GetAttribute("type"), "date", StringComparison.OrdinalIgnoreCase))
        {
            var js = (IJavaScriptExecutor)_driver;
            js.ExecuteScript(
                "arguments[0].value = arguments[1];" +
                "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));" +
                "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
                input,
                value);
            return;
        }

        input.Clear();
        input.SendKeys(value);
    }

    private string GetInputValue(string name)
    {
        var input = WaitForInput(name);
        return input.GetAttribute("value");
    }

    private IWebElement WaitForInput(string name)
    {
        return _wait.Until(d =>
        {
            var el = d.FindElement(By.CssSelector($"input[name='{name}']"));
            return el.Displayed ? el : null;
        });
    }

    private IWebElement WaitForSelect(string name)
    {
        return _wait.Until(d =>
        {
            var el = d.FindElement(By.CssSelector($"select[name='{name}']"));
            return el.Displayed ? el : null;
        });
    }

    public void Dispose()
    {
        _driver.Quit();
        _driver.Dispose();
    }
}
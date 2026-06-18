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
    public class UnitTest1
    {
        [Fact]
        public void TestDeleteWorkout()
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

            // Emri unik për workout që do krijojmë dhe pastaj fshijmë
            var uniqueName = "DeleteTest " + DateTime.Now.Ticks;

            try
            {
                // ===== HAPI 1: LOGIN =====
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

                // ===== HAPI 2: KRIJO WORKOUT =====
                driver.Navigate().GoToUrl("http://localhost:5173/user/workouts");

                wait.Until(d => d.FindElement(By.Id("addworkout-button")).Displayed);
                driver.FindElement(By.Id("addworkout-button")).Click();

                var workoutName = wait.Until(d =>
                {
                    var el = d.FindElements(By.Id("workout-name")).FirstOrDefault();
                    return el != null && el.Displayed && el.Enabled ? el : null;
                });

                workoutName.SendKeys(uniqueName);
                driver.FindElement(By.Id("save-workout")).Click();

                // Prit derisa URL të ndryshojë
                wait.Until(d =>
                {
                    var currentUrl = d.Url;
                    return currentUrl.Contains("/user/workouts") ||
                           currentUrl.Contains("/user/exercises") ||
                           currentUrl.Contains("/exercise");
                });

                // ===== HAPI 3: KTHIM TE WORKOUTS DHE VERIFIKIM =====
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

                // ===== HAPI 4: KLIK DELETE BUTTON TE KARTA =====
                var deleteButton = wait.Until(d =>
                {
                    try
                    {
                        var cards = d.FindElements(By.CssSelector(".card"));
                        var targetCard = cards.FirstOrDefault(c => c.Text.Contains(uniqueName));
                        if (targetCard == null) return null;

                        var btn = targetCard.FindElements(By.Id("deleteworkout-button")).FirstOrDefault();
                        if (btn != null && btn.Displayed) return btn;

                        // Fallback
                        return d.FindElements(By.Id("deleteworkout-button")).FirstOrDefault();
                    }
                    catch (StaleElementReferenceException) { return null; }
                });

                Assert.NotNull(deleteButton);

                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", deleteButton);
                Thread.Sleep(500);
                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", deleteButton);

                // ===== HAPI 5: KONFIRMO TE MODAL I PARË (deleteworkout-modal) =====
                Thread.Sleep(1000);

                var firstConfirmBtn = wait.Until(d =>
                {
                    try
                    {
                        var btn = d.FindElements(By.Id("deleteworkout-modal")).FirstOrDefault();
                        return btn != null && btn.Displayed ? btn : null;
                    }
                    catch (StaleElementReferenceException) { return null; }
                });

                Assert.NotNull(firstConfirmBtn);

                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", firstConfirmBtn);
                Thread.Sleep(500);
                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", firstConfirmBtn);

                // ===== HAPI 6: KONFIRMO TE MODAL I DYTË (confirmModal) =====
                Thread.Sleep(1000);

                var secondConfirmBtn = wait.Until(d =>
                {
                    try
                    {
                        // Modal 2 ka button.btn-danger me text "Delete Workout"
                        // NUK ka ID, e gjejmë me text
                        var allButtons = d.FindElements(By.CssSelector("button.btn-danger"));
                        var visibleBtns = allButtons.Where(b => b.Displayed && b.Enabled).ToList();

                        // Marrim butonin e fundit (modal i dytë mbi modal i parë)
                        return visibleBtns.LastOrDefault();
                    }
                    catch (StaleElementReferenceException) { return null; }
                });

                Assert.NotNull(secondConfirmBtn);

                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", secondConfirmBtn);
                Thread.Sleep(500);
                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", secondConfirmBtn);

                // ===== HAPI 7: PRIT DELETIM =====
                Thread.Sleep(2000);

                // ===== HAPI 8: REFRESH DHE VERIFIKO ZHDUKJEN =====
                driver.Navigate().Refresh();
                Thread.Sleep(1500);

                wait.Until(d =>
                {
                    try
                    {
                        var cards = d.FindElements(By.CssSelector(".card"));
                        return !cards.Any(c => c.Text.Contains(uniqueName));
                    }
                    catch (StaleElementReferenceException) { return false; }
                });

                // Test passed nëse arrijmë këtu pa exception
            }
            finally
            {
                driver.Quit();
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Fitness.Presentation.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly FitnessDbContext _db;

        public StatsController(FitnessDbContext db)
        {
            _db = db;
        }

        [HttpGet("clients/total")]
        public async Task<IActionResult> GetTotalClients()
        {
            var total = await _db.Clients.CountAsync();
            if (total == 0)
            {
                return Ok(new { total = 42 }); // mock
            }
            return Ok(new { total });
        }

        [HttpGet("clients/age-buckets")]
        public async Task<IActionResult> GetClientsAgeBuckets()
        {
            // Load birthdays via navigation property
            var birthdays = await _db.Clients
                .Include(c => c.User)
                .Select(c => c.User.Birthday)
                .ToListAsync();

            var buckets = new Dictionary<string, int>
            {
                { "<18", 0 },
                { "18-24", 0 },
                { "25-34", 0 },
                { "35-44", 0 },
                { "45+", 0 }
            };

            foreach (var dob in birthdays)
            {
                if (dob == null) continue;
                var age = CalculateAge(dob.Value);
                if (age < 18) buckets["<18"]++;
                else if (age <= 24) buckets["18-24"]++;
                else if (age <= 34) buckets["25-34"]++;
                else if (age <= 44) buckets["35-44"]++;
                else buckets["45+"]++;
            }
            if (!birthdays.Any(b => b != null))
            {
                // mock distribution
                buckets["<18"] = 5;
                buckets["18-24"] = 12;
                buckets["25-34"] = 15;
                buckets["35-44"] = 7;
                buckets["45+"] = 3;
            }
            return Ok(buckets);
        }

        [HttpGet("clients/gender")]
        public async Task<IActionResult> GetClientsByGender()
        {
            var genders = await _db.Clients
                .Include(c => c.User)
                .Select(c => c.User.Gender)
                .ToListAsync();

            int male = 0, female = 0, other = 0;
            foreach (var g in genders)
            {
                var val = (g ?? string.Empty).Trim().ToLowerInvariant();
                if (val == "male" || val == "m" || val == "djal" || val == "mashkull") male++;
                else if (val == "female" || val == "f" || val == "vajz" || val == "femër" || val == "femer") female++;
                else other++;
            }

            var result = new Dictionary<string, int>
            {
                { "Male", male },
                { "Female", female },
                { "Other", other }
            };
            if (male + female + other == 0)
            {
                // mock gender split
                result["Male"] = 22;
                result["Female"] = 18;
                result["Other"] = 2;
            }
            return Ok(result);
        }

        [HttpGet("top/exercises")]
        public async Task<IActionResult> GetTopExercises([FromQuery] int count = 5)
        {
            if (count <= 0) count = 5;

            var top = await _db.WorkoutExercises
                .Join(_db.Workouts,
                    we => we.WorkoutId,
                    w => w.WorkoutId,
                    (we, w) => new { we.ExerciseId, w.ClientId })
                .GroupBy(x => x.ExerciseId)
                .Select(g => new { ExerciseId = g.Key, ClientCount = g.Select(x => x.ClientId).Distinct().Count() })
                .OrderByDescending(x => x.ClientCount)
                .ThenBy(x => x.ExerciseId)
                .Take(count)
                .Join(_db.Exercises,
                    t => t.ExerciseId,
                    e => e.ExerciseId,
                    (t, e) => new { name = e.Name, count = t.ClientCount })
                .ToListAsync();

            if (top.Count == 0)
            {
                // mock top exercises
                var mock = new[]
                {
                    new { name = "Push-ups", count = 30 },
                    new { name = "Squats", count = 25 },
                    new { name = "Plank", count = 20 },
                    new { name = "Deadlift", count = 18 },
                    new { name = "Bench Press", count = 16 },
                };
                return Ok(mock);
            }
            return Ok(top);
        }

        [HttpGet("top/foods")]
        public async Task<IActionResult> GetTopFoods([FromQuery] int count = 5)
        {
            if (count <= 0) count = 5;

            var top = await _db.MealFoods
                .Join(_db.Meals,
                    mf => mf.MealId,
                    m => m.MealId,
                    (mf, m) => new { mf.FoodId, m.ClientId })
                .GroupBy(x => x.FoodId)
                .Select(g => new { FoodId = g.Key, ClientCount = g.Select(x => x.ClientId).Distinct().Count() })
                .OrderByDescending(x => x.ClientCount)
                .ThenBy(x => x.FoodId)
                .Take(count)
                .Join(_db.Foods,
                    t => t.FoodId,
                    f => f.FoodId,
                    (t, f) => new { name = f.Name, count = t.ClientCount })
                .ToListAsync();

            if (top.Count == 0)
            {
                // mock top foods
                var mock = new[]
                {
                    new { name = "Chicken Breast", count = 28 },
                    new { name = "Brown Rice", count = 24 },
                    new { name = "Broccoli", count = 22 },
                    new { name = "Greek Yogurt", count = 19 },
                    new { name = "Oats", count = 17 },
                };
                return Ok(mock);
            }
            return Ok(top);
        }

        private static int CalculateAge(DateOnly birthDate)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            int age = today.Year - birthDate.Year;
            if (birthDate.AddYears(age) > today) age--;
            return age;
        }
    }
}

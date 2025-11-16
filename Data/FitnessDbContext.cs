using System;
using System.Collections.Generic;
using Fitness.Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Data;

public partial class FitnessDbContext : IdentityDbContext<ApplicationUser>
{
    public FitnessDbContext(DbContextOptions<FitnessDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<Exercise> Exercises { get; set; }

    public virtual DbSet<Food> Foods { get; set; }

    public virtual DbSet<Goal> Goals { get; set; }

    public virtual DbSet<Meal> Meals { get; set; }

    public virtual DbSet<MealFood> MealFoods { get; set; }

    public virtual DbSet<Progress> Progresses { get; set; }

    public virtual DbSet<Workout> Workouts { get; set; }

    public virtual DbSet<WorkoutExercise> WorkoutExercises { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__Admin__719FE48806B48856");

            entity.ToTable("Admin");

            entity.Property(e => e.UserId).HasMaxLength(450);

            entity.HasOne(d => d.User).WithMany(p => p.Admins)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Admin__UserId__4CA06362");
        });



        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.ClientId).HasName("PK__Client__E67E1A248FC8850D");

            entity.ToTable("Client");

            entity.Property(e => e.UserId).HasMaxLength(450);

            entity.HasOne(d => d.User).WithMany(p => p.Clients)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Client__UserId__4F7CD00D");
        });

        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.ExerciseId).HasName("PK__Exercise__A074AD2FEE5F72B2");

            entity.ToTable("Exercise");

            entity.Property(e => e.ImageUrl).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.VideoUrl).HasMaxLength(255);
        });

        modelBuilder.Entity<Food>(entity =>
        {
            entity.HasKey(e => e.FoodId).HasName("PK__Food__856DB3EBA8511536");

            entity.ToTable("Food");

            entity.Property(e => e.ImageUrl).HasMaxLength(450);
        });

        modelBuilder.Entity<Goal>(entity =>
        {
            entity.HasKey(e => e.GoalId).HasName("PK__Goal__8A4FFFD123AF4F7E");

            entity.ToTable("Goal");

            entity.Property(e => e.GoalType).HasMaxLength(450);

            entity.HasOne(d => d.Client).WithMany(p => p.Goals)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Goal__ClientId__693CA210");
        });

        modelBuilder.Entity<Meal>(entity =>
        {
            entity.HasKey(e => e.MealId).HasName("PK__Meal__ACF6A63D51CD5CBA");

            entity.ToTable("Meal");

            entity.Property(e => e.MealName).HasMaxLength(450);

            entity.HasOne(d => d.Client).WithMany(p => p.Meals)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Meal__ClientId__628FA481");
        });

        modelBuilder.Entity<MealFood>(entity =>
        {
            entity.HasKey(e => new { e.FoodId, e.MealId }).HasName("PK__MealFood__4FA2D988D8EF5FE2");

            entity.ToTable("MealFood");

            entity.HasOne(d => d.Food).WithMany(p => p.MealFoods)
                .HasForeignKey(d => d.FoodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MealFood__FoodId__66603565");

            entity.HasOne(d => d.Meal).WithMany(p => p.MealFoods)
                .HasForeignKey(d => d.MealId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MealFood__MealId__656C112C");
        });

        modelBuilder.Entity<Progress>(entity =>
        {
            entity.HasKey(e => e.MealId).HasName("PK__Progress__ACF6A63DC633405C");

            entity.ToTable("Progress");

            entity.Property(e => e.Date).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Client).WithMany(p => p.Progresses)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Progress__Client__6D0D32F4");
        });

        modelBuilder.Entity<Workout>(entity =>
        {
            entity.HasKey(e => e.WorkoutId).HasName("PK__Workout__E1C42A010125B071");

            entity.ToTable("Workout");

            entity.Property(e => e.Title).HasMaxLength(50);

            entity.HasOne(d => d.Client).WithMany(p => p.Workouts)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Workout__ClientI__52593CB8");
        });

        modelBuilder.Entity<WorkoutExercise>(entity =>
        {
            entity.HasKey(e => new { e.WorkoutId, e.ExerciseId }).HasName("PK__WorkoutE__0BC360D3AEE1C743");

            entity.ToTable("WorkoutExercise");

            entity.HasOne(d => d.Exercise).WithMany(p => p.WorkoutExercises)
                .HasForeignKey(d => d.ExerciseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WorkoutEx__Exerc__5DCAEF64");

            entity.HasOne(d => d.Workout).WithMany(p => p.WorkoutExercises)
                .HasForeignKey(d => d.WorkoutId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WorkoutEx__Worko__5CD6CB2B");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

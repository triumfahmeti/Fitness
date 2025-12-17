using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitness.Migrations
{
    /// <inheritdoc />
    public partial class AddProfileUniqueIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop existing indexes if they exist to allow recreating as UNIQUE
            migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Client_UserId' AND object_id = OBJECT_ID('Client'))
    DROP INDEX [IX_Client_UserId] ON [Client];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Admin_UserId' AND object_id = OBJECT_ID('Admin'))
    DROP INDEX [IX_Admin_UserId] ON [Admin];
");

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Expires = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                });

            // Create unique indexes only if tables already exist
            migrationBuilder.Sql(@"
IF OBJECT_ID('Client','U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Client_UserId' AND object_id = OBJECT_ID('Client'))
    CREATE UNIQUE INDEX [IX_Client_UserId] ON [Client] ([UserId]);
IF OBJECT_ID('Admin','U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Admin_UserId' AND object_id = OBJECT_ID('Admin'))
    CREATE UNIQUE INDEX [IX_Admin_UserId] ON [Admin] ([UserId]);
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefreshTokens");

            // Recreate non-unique indexes (if needed) by dropping unique ones first
            migrationBuilder.Sql(@"
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Client_UserId' AND object_id = OBJECT_ID('Client'))
    DROP INDEX [IX_Client_UserId] ON [Client];
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Admin_UserId' AND object_id = OBJECT_ID('Admin'))
    DROP INDEX [IX_Admin_UserId] ON [Admin];
");

            migrationBuilder.CreateIndex(
                name: "IX_Client_UserId",
                table: "Client",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Admin_UserId",
                table: "Admin",
                column: "UserId");
        }
    }
}

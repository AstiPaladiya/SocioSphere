using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable

        //contruct of this controller
        public ExpensesController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        //Display all Data
        [HttpGet]
        public IActionResult getAllExpenses()
        {
            try
            {
                var allExpenses = dbContext.ExpensesMasters.ToList();
                if (allExpenses == null || !allExpenses.Any())
                {
                    return NotFound(new { message = "No Expenses type found!" });
                }
                return Ok(allExpenses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });
            }
        }
        //get data by id
        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getExpensesById(int id)
        {
            try
            {
                var expenses = dbContext.ExpensesMasters.Find(id);
            if (expenses == null)
            {
                    return NotFound(new { message = "Expense record not found." });
                }
            return Ok(expenses);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
        //Add Data
        [HttpPost]
        public IActionResult addExpenses(AddExpensesData addExpensesData)
        {
            try
            {
                //if (addSocietyCommitte == null)
                //{
                //    return BadRequest(new { msg = "The value is null." });
                //}
                var expensesEntity = new ExpensesMaster
                {
                    ExpensesName = addExpensesData.ExpensesName,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.ExpensesMasters.Add(expensesEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Expenses added successfully !" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        //Update data
        [HttpPut]
        [Route("{id:int}")]
        public IActionResult updateExpenses(int id, UpdateExpensesData updateExpensesData)
        {
            try
            {
                var expenses = dbContext.ExpensesMasters.Find(id);
                if (expenses == null)
                {
                    return NotFound(new { message = "Society Committe Data not found" });
                }
                expenses.ExpensesName = updateExpensesData.ExpensesName;
                expenses.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Expenses updated succesfully !" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        //Update status 
        [HttpPut]
        [Route("toggleStatus/{id:int}")]
        public IActionResult toggleExpensesStatus(int id)
        {
            try
            {
                var expenses = dbContext.ExpensesMasters.Find(id);
                if (expenses == null)
                {
                    return NotFound(new { message = "Expenses not found" });

                }
                if (expenses.Status == "Active")
                {
                    expenses.Status = "Block";
                }
                else
                {
                    expenses.Status = "Active";
                }
                expenses.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = $"Expenses status {expenses.Status} successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

    }
}

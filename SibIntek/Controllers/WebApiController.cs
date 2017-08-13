using SibIntek.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SibIntek.Controllers
{
    public class WebApiController : ApiController
    {
        private Repository repository = new Repository();

        // GET api/GetTasks
        [Route("api/GetTasks")]
        public List<Tasks> GetTasks()
        {
            return repository.getTasks();
        }


        // GET api/updateTasks
        [HttpPost]
        [Route("api/updateTasks")]
        public object updateTasks(Tasks task)
        {
            try
            {
                repository.updateTasks(task);
                return new { Error = false, Message = "Task update...", Class="green" };
            }
            catch (Exception e)
            {
                return new { Error = true, Message = e.Message, Class = "red" };
            }
        }

        // GET api/addTasks
        [HttpPost]
        [Route("api/addTasks")]
        public object addTasks(Tasks task)
        {
            try
            {
                repository.addTasks(task);
                return new { Error = false, Message = "Task add...", Class = "green" };
            }
            catch (Exception e)
            {
                return new { Error = true, Message = e.Message, Class = "red" };
            }
        }

        // GET api/addTasks
        [HttpPost]
        [Route("api/deleteTask")]
        public object deleteTask(Tasks task)
        {
            try
            {
                repository.deleteTasks(task);
                return new { Error = false, Message = "Task delete...", Class = "green" };
            }
            catch (Exception e)
            {
                return new { Error = true, Message = e.Message, Class = "red" };
            }
        }
    }
}
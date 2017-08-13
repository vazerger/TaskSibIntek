using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SibIntek.Models;

namespace SibIntek.Models
{
    public class Repository
    {
        private  Entities _db = new Entities();

        public List<Tasks> getTasks()
        {
            return _db.Tasks.OrderBy(c => c.Id).ToList();
        }

        public void updateTasks(Tasks task)
        {
            var _task = _db.Tasks.Find(task.Id);
            _task.Check = task.Check;
            _db.SaveChanges();
        }

        public void addTasks(Tasks task)
        {
            _db.Tasks.Add(task);
            _db.SaveChanges();
        }

        public void deleteTasks(Tasks task)
        {
            var _task = _db.Tasks.Find(task.Id);
            _db.Tasks.Remove(_task);
            _db.SaveChanges();
        }

    }
}
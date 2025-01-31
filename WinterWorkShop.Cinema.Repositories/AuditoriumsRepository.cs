﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WinterWorkShop.Cinema.Data;

namespace WinterWorkShop.Cinema.Repositories
{
    public interface IAuditoriumsRepository : IRepository<Auditorium> 
    {
        Task<IEnumerable<Auditorium>> GetByAuditName(string name, int id);

        Task<IEnumerable<Auditorium>> GetByCinemaId(Guid cinemaId);
    }
    public class AuditoriumsRepository : IAuditoriumsRepository
    {
        private CinemaContext _cinemaContext;

        public AuditoriumsRepository(CinemaContext cinemaContext)
        {
            _cinemaContext = cinemaContext;
        }


        public async Task<IEnumerable<Auditorium>> GetByAuditName(string name, int id)
        {
            var data = await _cinemaContext.Auditoria.Where(x => x.Name.Equals(name) && x.CinemaId.Equals(id)).ToListAsync();

            return data;
        }

        public async Task<IEnumerable<Auditorium>> GetByCinemaId(Guid cinemaId)
        {
            var data = await _cinemaContext.Auditoria.Where(x => x.CinemaId == cinemaId).ToListAsync();

            return data;
        }

        public Auditorium Delete(object id)
        {
            Auditorium existing = _cinemaContext.Auditoria.Find(id);
            var result = _cinemaContext.Auditoria.Remove(existing);

            return result.Entity;
        }

        public async Task<IEnumerable<Auditorium>> GetAllAsync()
        {
            var data = await _cinemaContext.Auditoria.ToListAsync();

            return data;
        }

        public async Task<Auditorium> GetByIdAsync(object id)
        {
            return await _cinemaContext.Auditoria.FindAsync(id);
        }

        public Auditorium Insert(Auditorium obj)
        {
            var data = _cinemaContext.Auditoria.Add(obj).Entity;

            return data;
        }

        public void Save()
        {
            _cinemaContext.SaveChanges();
        }

        public Auditorium Update(Auditorium obj)
        {
            var updatedEntry = _cinemaContext.Auditoria.Attach(obj);
            _cinemaContext.Entry(obj).State = EntityState.Modified;

            return updatedEntry.Entity;
        }
    }
}

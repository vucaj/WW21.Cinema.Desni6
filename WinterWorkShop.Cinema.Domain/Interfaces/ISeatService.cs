﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WinterWorkShop.Cinema.Domain.Models;

namespace WinterWorkShop.Cinema.Domain.Interfaces
{
    public interface ISeatService
    {
        Task<IEnumerable<SeatDomainModel>> GetAllAsync();
        Task<GetSeatResultModel> GetByIdAsync(SeatDomainModel domainModel);
        Task<IEnumerable<SeatDomainModel>> GetAllByAuditoriumIdAsync(AuditoriumDomainModel domainModel);
        Task<IEnumerable<SeatDomainModel>> GetByAllSeatTypeAsync(SeatDomainModel domainModel);

    }
}

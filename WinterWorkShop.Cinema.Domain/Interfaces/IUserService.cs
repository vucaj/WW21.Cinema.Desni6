﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WinterWorkShop.Cinema.Domain.Models;

namespace WinterWorkShop.Cinema.Domain.Interfaces
{
    public interface IUserService
    {
        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns>List of Users</returns>
        Task<IEnumerable<UserDomainModel>> GetAllAsync();

        /// <summary>
        /// Get a user by ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns>User</returns>
        Task<UserDomainResultModel> GetUserByIdAsync(Guid id);

        /// <summary>
        /// Get a user by username
        /// </summary>
        /// <param name="username"></param>
        /// <returns>User</returns>
        UserDomainResultModel GetUserByUserName(string username);

        Task<UserDomainResultModel> CreateUser(UserDomainModel domainModel);
    }
}

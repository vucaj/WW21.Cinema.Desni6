﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WinterWorkShop.Cinema.API.Models
{
    public class DeleteAddressModel
    {
        [Required]
        public int AddressId { get; set; }
    }
}

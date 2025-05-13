using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

    public partial class SuggestionMaster
    {
        public int Id { get; set; }

        public int? Userid { get; set; }

        public string? SuggestionTitle { get; set; }

        public string? Description { get; set; }

        public string? Photo { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<SuggestionVote> SuggestionVotes { get; set; } = new List<SuggestionVote>();

        public virtual UserMaster? User { get; set; }
    }



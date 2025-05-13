using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

    public partial class SuggestionVote
    {
        public int Id { get; set; }

        public int? SuggestionId { get; set; }

        public int? UserId { get; set; }

        public bool? Isliked { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public virtual SuggestionMaster? Suggestion { get; set; }

        public virtual UserMaster? User { get; set; }
    }


namespace SocioSphere.Models.UserDataModels.UpdateUserData
{
    public class UpdateAgencyContactData
    {
        public int? AgencyTypeId { get; set; }

        public string? ContactPersonName { get; set; }

        public string? Location { get; set; }

        public string? EmailId { get; set; }

        public long? ContactNo { get; set; }

        public long? AlternateContactNo { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Configuration;
using Microsoft.EntityFrameworkCore;

namespace SocioSphere.Models.Entity;

public partial class SociosphereContext : DbContext
{
    private IConfiguration _configuration;
    public SociosphereContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public SociosphereContext(DbContextOptions<SociosphereContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;

    }

    public virtual DbSet<AgencyContact> AgencyContacts { get; set; }

    public virtual DbSet<AgencyMaster> AgencyMasters { get; set; }

    public virtual DbSet<Agendum> Agenda { get; set; }

    public virtual DbSet<ComplainMaster> ComplainMasters { get; set; }

    public virtual DbSet<ComplainType> ComplainTypes { get; set; }

    public virtual DbSet<EventGallery> EventGalleries { get; set; }

    public virtual DbSet<EventMaster> EventMasters { get; set; }

    public virtual DbSet<ExpensesMaster> ExpensesMasters { get; set; }

    public virtual DbSet<ExpensesRecord> ExpensesRecords { get; set; }

    public virtual DbSet<GroupMaster> GroupMasters { get; set; }

    public virtual DbSet<MaintenanceChargeMaster> MaintenanceChargeMasters { get; set; }

    public virtual DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }

    public virtual DbSet<PaidEventRecord> PaidEventRecords { get; set; }

    public virtual DbSet<SettingMenu> SettingMenus { get; set; }

    public virtual DbSet<SocietyMeeting> SocietyMeetings { get; set; }

    public virtual DbSet<SuggestionMaster> SuggestionMasters { get; set; }

    public virtual DbSet<SuggestionVote> SuggestionVotes { get; set; }

    public virtual DbSet<UserMaster> UserMasters { get; set; }

    public virtual DbSet<UserPersonalDetail> UserPersonalDetails { get; set; }

    public virtual DbSet<Visiter> Visiters { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(_configuration.GetConnectionString("sociosphereDb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AgencyContact>(entity =>
        {
            entity.ToTable("agency_contact");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AgencyTypeId).HasColumnName("agency_type_id");
            entity.Property(e => e.AlternateContactNo).HasColumnName("alternate_contact_no");
            entity.Property(e => e.ContactNo).HasColumnName("contact_no");
            entity.Property(e => e.ContactPersonName)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("contact_person_name");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.EmailId)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("email_id");
            entity.Property(e => e.Location)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("location");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.AgencyType).WithMany(p => p.AgencyContacts)
                .HasForeignKey(d => d.AgencyTypeId)
                .HasConstraintName("FK_agency_contact_agency_master");
        });

        modelBuilder.Entity<AgencyMaster>(entity =>
        {
            entity.ToTable("agency_master");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AgencyTypeName)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("agency_type_name");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<Agendum>(entity =>
        {
            entity.ToTable("agenda");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ActionTakenNote)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("action_taken_note");
            entity.Property(e => e.AgendaDescription)
                .HasColumnType("text")
                .HasColumnName("agenda_description");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Priority)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("priority");
            entity.Property(e => e.SocietyMeetingId).HasColumnName("society_meeting_id");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserAgendaId).HasColumnName("user_agenda_id");

            entity.HasOne(d => d.SocietyMeeting).WithMany(p => p.Agenda)
                .HasForeignKey(d => d.SocietyMeetingId)
                .HasConstraintName("FK_agenda_society_meeting");

            entity.HasOne(d => d.UserAgenda).WithMany(p => p.Agenda)
                .HasForeignKey(d => d.UserAgendaId)
                .HasConstraintName("FK_agenda_user_master");
        });

              modelBuilder.Entity<ComplainMaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_complain_suggestion_master");

            entity.ToTable("complain_master");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ActionTakenDueDate).HasColumnName("action_taken_due_date");
            entity.Property(e => e.AdminActionTakenNote)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("admin_action_taken_note");
            entity.Property(e => e.ComplainTitle)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("complain_title");
            entity.Property(e => e.ComplainTypeId).HasColumnName("complain_type_id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Photo)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("photo");
            entity.Property(e => e.Priority)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("priority");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.ComplainType).WithMany(p => p.ComplainMasters)
                .HasForeignKey(d => d.ComplainTypeId)
                .HasConstraintName("FK_complain_suggestion_master_complain_type");

            entity.HasOne(d => d.User).WithMany(p => p.ComplainMasters)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_complain_suggestion_master_user_master");
        });

        modelBuilder.Entity<ComplainType>(entity =>
        {
            entity.ToTable("complain_type");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ComplainName)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("complain_name");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<EventGallery>(entity =>
        {
            entity.ToTable("event_gallery");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.EventId).HasColumnName("event_id");
            entity.Property(e => e.Photo)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("photo");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.HasOne(d => d.Event).WithMany(p => p.EventGalleries)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK_event_gallery_event_master");

            entity.HasOne(d => d.User).WithMany(p => p.EventGalleries)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_event_gallery_user_master");
        });

        modelBuilder.Entity<EventMaster>(entity =>
        {
            entity.ToTable("event_master");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Destination)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("destination");
            entity.Property(e => e.EventDate).HasColumnName("event_date");
            entity.Property(e => e.EventName)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("event_name");
            entity.Property(e => e.EventTime).HasColumnName("event_time");
            entity.Property(e => e.EventType)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("event_type");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.PriceType)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("price_type");
            entity.Property(e => e.Reason)
           .HasMaxLength(200)
           .IsUnicode(false)
           .HasColumnName("reason");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<ExpensesMaster>(entity =>
        {
            entity.ToTable("expenses_master");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ExpensesName)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("expenses_name");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<ExpensesRecord>(entity =>
        {
            entity.ToTable("expenses_record");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.ExpensesDate).HasColumnName("expenses_date");
            entity.Property(e => e.ExpensesTitle)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("expenses_title");
            entity.Property(e => e.ExpensesTypeId).HasColumnName("expenses_type_id");
            entity.Property(e => e.BillImage)
               .HasMaxLength(400)
               .IsUnicode(false)
               .HasColumnName("bill_image");
            entity.Property(e => e.Invoice)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("invoice");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.ExpensesType).WithMany(p => p.ExpensesRecords)
                .HasForeignKey(d => d.ExpensesTypeId)
                .HasConstraintName("FK_expenses_record_expenses_master");
        });

        modelBuilder.Entity<GroupMaster>(entity =>
        {
            entity.ToTable("group_master");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.GroupName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("group_name");
        });

        modelBuilder.Entity<MaintenanceChargeMaster>(entity =>
        {
            entity.ToTable("maintenance_charge_master");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.DueMonthYear).HasColumnName("due_month_year");
            entity.Property(e => e.EndMonthYear).HasColumnName("end_month_year");
            entity.Property(e => e.LatePaymentCharge).HasColumnName("late_payment_charge");
            entity.Property(e => e.MaintenanceCharge).HasColumnName("maintenance_charge");
            entity.Property(e => e.MaintenanceType)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("maintenance_type");
            entity.Property(e => e.StartingMonthYear).HasColumnName("starting_month_year");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<MaintenanceRecord>(entity =>
        {
            entity.ToTable("maintenance_record");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.LatePaymentAmount).HasColumnName("late_payment_amount");
            entity.Property(e => e.LatePaymentReason).HasColumnName("late_payment_reason");
            entity.Property(e => e.MaintenanceId).HasColumnName("maintenance_id");
            entity.Property(e => e.PaidDate).HasColumnName("paid_date");
            entity.Property(e => e.PaymentImage)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("payment_image");
            entity.Property(e => e.ReceiptNo)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("receipt_no");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.TotalMaintenance).HasColumnName("total_maintenance");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Maintenance).WithMany(p => p.MaintenanceRecords)
                .HasForeignKey(d => d.MaintenanceId)
                .HasConstraintName("FK_maintenance_record_maintenance_charge_master");

            entity.HasOne(d => d.User).WithMany(p => p.MaintenanceRecords)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_maintenance_record_user_master");
        });

        modelBuilder.Entity<PaidEventRecord>(entity =>
        {
            entity.ToTable("paid_event_record");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.EventId).HasColumnName("event_id");
            entity.Property(e => e.PaymentImage)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("payment_image");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.TotalMember).HasColumnName("total_member");
            entity.Property(e => e.TotalPrice).HasColumnName("total_price");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Event).WithMany(p => p.PaidEventRecords)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK_paid_event_record_event_master");

            entity.HasOne(d => d.User).WithMany(p => p.PaidEventRecords)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_paid_event_record_user_master");
        });

        modelBuilder.Entity<SettingMenu>(entity =>
        {
            entity.ToTable("setting_menu");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.KeyName)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("key_name");
            entity.Property(e => e.Value)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("value");
        });


        modelBuilder.Entity<SocietyMeeting>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Table_1");

            entity.ToTable("society_meeting");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.Location)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("location");
            entity.Property(e => e.MeetingName)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("meeting_name");
            entity.Property(e => e.Notice)
                .HasColumnType("text")
                .HasColumnName("notice");
            entity.Property(e => e.Photo)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("photo");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.Time).HasColumnName("time");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });
        modelBuilder.Entity<SuggestionMaster>(entity =>
        {
            entity.ToTable("suggestion_master");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Photo)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("photo");
            entity.Property(e => e.SuggestionTitle)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("suggestion_title");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.User).WithMany(p => p.SuggestionMasters)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("FK_suggestion_master_user_master");
        });

        modelBuilder.Entity<SuggestionVote>(entity =>
        {
            entity.ToTable("suggestion_vote");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
              .HasColumnType("datetime")
              .HasColumnName("created_at");
            entity.Property(e => e.Isliked).HasColumnName("isliked");
            entity.Property(e => e.SuggestionId).HasColumnName("suggestion_id");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Suggestion).WithMany(p => p.SuggestionVotes)
                .HasForeignKey(d => d.SuggestionId)
                .HasConstraintName("FK_suggestion_vote_suggestion_master");

            entity.HasOne(d => d.User).WithMany(p => p.SuggestionVotes)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_suggestion_vote_user_master");
        });
        modelBuilder.Entity<UserMaster>(entity =>
        {
            entity.ToTable("user_master");

            entity.HasIndex(e => e.Id, "IX_user_master");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasColumnType("text")
                .HasColumnName("address");
            entity.Property(e => e.AdharcardNo).HasColumnName("adharcard_no");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("first_name");
            entity.Property(e => e.Gender)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("gender");
            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.LastName)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("last_name");
            entity.Property(e => e.LivingDate).HasColumnName("living_date");
            entity.Property(e => e.MiddleName)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("middle_name");
            entity.Property(e => e.Password)
                .HasColumnType("text")
                .HasColumnName("password");
            entity.Property(e => e.PhoneNo).HasColumnName("phone_no");
            entity.Property(e => e.ProfilePhoto)
                .HasMaxLength(400)
                .IsUnicode(false)
                .HasColumnName("profile_photo");
            entity.Property(e => e.SquarfootSize).HasColumnName("squarfoot_size");
            entity.Property(e => e.Status)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.TotalFamilyMember).HasColumnName("total_family_member");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");


            entity.HasOne(d => d.Group).WithMany(p => p.UserMasters)
                .HasForeignKey(d => d.GroupId)
                .HasConstraintName("FK_user_master_group_master");
        });

        modelBuilder.Entity<UserPersonalDetail>(entity =>
        {
            entity.ToTable("user_personal_detail");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AnotherIdProof)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("another_id_proof");
            entity.Property(e => e.AnotherPhoneNo).HasColumnName("another_phone_no");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.FatherName)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("father_name");
            entity.Property(e => e.FlatNo).HasColumnName("flat_no");
            entity.Property(e => e.JoiningDate).HasColumnName("joining_date");
            entity.Property(e => e.MotherName)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("mother_name");
            entity.Property(e => e.NoOfChild).HasColumnName("no_of_child");
            entity.Property(e => e.Occupation)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("occupation");
            entity.Property(e => e.RelationshipStatus)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("relationship_status");
            entity.Property(e => e.Salary).HasColumnName("salary");
            entity.Property(e => e.ShiftEndTime).HasColumnName("shift_end_time");
            entity.Property(e => e.ShiftStartTime).HasColumnName("shift_start_time");
            entity.Property(e => e.SpouseName)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("spouse_name");
            entity.Property(e => e.SpouseOccupation)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("spouse_occupation");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.WorkExperience)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("work_experience");

            entity.HasOne(d => d.User).WithMany(p => p.UserPersonalDetails)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_user_personal_detail_user_master");
        });

        modelBuilder.Entity<Visiter>(entity =>
        {
            entity.ToTable("visiter");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.EntryDate).HasColumnName("entry_date");
            entity.Property(e => e.EntryTime).HasColumnName("entry_time");
            entity.Property(e => e.ExitDate).HasColumnName("exit_date");
            entity.Property(e => e.ExitTime).HasColumnName("exit_time");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.PhoneNo).HasColumnName("phone_no");
            entity.Property(e => e.Photo)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("photo");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.VisitingUserId).HasColumnName("visiting_user_id");
            entity.Property(e => e.WatchmenId).HasColumnName("watchmen_id");

            entity.HasOne(d => d.VisitingUser).WithMany(p => p.VisiterVisitingUsers)
                .HasForeignKey(d => d.VisitingUserId)
                .HasConstraintName("FK_visiter_user_master");

            entity.HasOne(d => d.Watchmen).WithMany(p => p.VisiterWatchmen)
                .HasForeignKey(d => d.WatchmenId)
                .HasConstraintName("FK_visiter_user_master1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

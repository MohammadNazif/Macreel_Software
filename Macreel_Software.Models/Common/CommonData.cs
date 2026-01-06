namespace Macreel_Software.Models.Common
{
    public class CommonData

    {
        public int Id { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public int day { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public TimeSpan InTime { get; set; }
        public TimeSpan OutTime { get; set; }
        public TimeSpan TotalHours { get; set; }
        public string FormattedDate { get; set; }
        public string FormattedInTime { get; set; }
        public string FormattedOutTime { get; set; }
        public string FormattedTotalHours { get; set; }
    }
    public enum MailBodyType
    {
        RegistrationLink,
        UserCredential,
        ForgotPassword,
        QuatationManagement,
        PerformaInvoice,
        TaxInvoice
    }
    public class MailRequest
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public MailBodyType BodyType { get; set; }

        // Optional data
        public string Value { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string otp { get; set; }
        public string clientName { get; set; }
        public string AttachmentPath { get; set; }
    }

    public class state
    {
        public int stateId { get; set; }

        public string stateName { get; set; }
    }

    public class city
    {
        public int cityId { get; set; }
        public int stateId { get; set; }
        public string stateName { get; set; }
        public string cityName { get; set; }
    }
}

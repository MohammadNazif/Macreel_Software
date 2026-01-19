namespace Macreel_Software.Server.DTOs
{
    public class TaskDto
    {
        public int id { get; set; }
        public int? empId { get; set; }
        public string? empName { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int? assignedBy { get; set; }
        public string document1Path { get; set; }
        public string document2Path { get; set; }
        public string? taskStatus { get; set; }
        public DateTime? assignedDate { get; set; }
    }
}

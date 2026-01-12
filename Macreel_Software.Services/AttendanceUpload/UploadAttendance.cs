using Macreel_Software.Models.Common;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;

namespace Macreel_Software.Services.AttendanceUpload
{
    public class UploadAttendance
    {
        public List<CommonData> ReadExcelFile(IFormFile file, int selectedMonth, int currentYear)
        {
            var attendances = new List<CommonData>();

            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded.");

            if (!Path.GetExtension(file.FileName)
                .Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
                return attendances;

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var stream = file.OpenReadStream())
            using (var package = new ExcelPackage(stream))
            {
                var worksheet = package.Workbook.Worksheets[0];
                if (worksheet == null || worksheet.Dimension == null)
                    return attendances;

                int rowCount = worksheet.Dimension.End.Row;
                int maxDays = DateTime.DaysInMonth(currentYear, selectedMonth);

                // Employees start from row 11, every employee block = 6 rows
                for (int row = 11; row <= rowCount; row += 6)
                {
                    string employeeCode = worksheet.Cells[row, 4].Text?.Trim();
                    string employeeName = worksheet.Cells[row, 14].Text?.Trim();

                    if (string.IsNullOrWhiteSpace(employeeCode) ||
                        employeeCode.Equals("E. Code", StringComparison.OrdinalIgnoreCase))
                        continue;

                    // Days start from column 3 (day 1)
                    for (int day = 1; day <= maxDays; day++)
                    {
                        int col = day + 2;

                        string status = worksheet.Cells[row + 1, col].Text?.Trim();
                        string inTimeText = worksheet.Cells[row + 2, col].Text?.Trim();
                        string outTimeText = worksheet.Cells[row + 3, col].Text?.Trim();
                        string totalHoursText = worksheet.Cells[row + 4, col].Text?.Trim();

                        // If everything is blank → skip (completely empty cell)
                        if (string.IsNullOrWhiteSpace(status) &&
                            string.IsNullOrWhiteSpace(inTimeText) &&
                            string.IsNullOrWhiteSpace(outTimeText))
                            continue;

                        // Default status handling
                        if (string.IsNullOrWhiteSpace(status))
                            status = "A"; // Absent / Holiday / WO fallback

                        TimeSpan inTime = ParseTime(inTimeText);
                        TimeSpan outTime = ParseTime(outTimeText);
                        TimeSpan totalHours = ParseTime(totalHoursText);

                        DateTime date = new DateTime(currentYear, selectedMonth, day);

                        attendances.Add(new CommonData
                        {
                            EmployeeCode = employeeCode,
                            EmployeeName = employeeName,
                            Status = status,
                            InTime = inTime,
                            OutTime = outTime,
                            TotalHours = totalHours,
                            Date = date,
                            day = day,
                            Month = selectedMonth,
                            Year = currentYear
                        });
                    }
                }
            }

            return attendances;
        }

        private TimeSpan ParseTime(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return TimeSpan.Zero;

            text = text.Replace(".", ":").Replace(" ", "").Trim();

            if (TimeSpan.TryParse(text, out TimeSpan ts))
                return ts;

            if (DateTime.TryParse(text, out DateTime dt))
                return dt.TimeOfDay;

            if (int.TryParse(text, out int hhmm))
            {
                int hours = hhmm / 100;
                int minutes = hhmm % 100;
                if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60)
                    return new TimeSpan(hours, minutes, 0);
            }

            return TimeSpan.Zero;
        }
    }
}

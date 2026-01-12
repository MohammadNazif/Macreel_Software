using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Macreel_Software.Services.MailSender
{
    public class PasswordEncrypt
    {
        private static readonly string EncryptionKey = "12345678901234567890123456789012";

        private static readonly string EncryptionIV = "1234567890123456";

        public string EncryptPassword(string password)
        {
            using Aes aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(EncryptionKey);
            aes.IV = Encoding.UTF8.GetBytes(EncryptionIV);

            using MemoryStream ms = new MemoryStream();
            using CryptoStream cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write);
            using StreamWriter sw = new StreamWriter(cs);

            sw.Write(password);
            sw.Close();

            return Convert.ToBase64String(ms.ToArray());
        }

  
        public string DecryptPassword(string encryptedPassword)
        {
            using Aes aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(EncryptionKey);
            aes.IV = Encoding.UTF8.GetBytes(EncryptionIV);

            byte[] buffer = Convert.FromBase64String(encryptedPassword);

            using MemoryStream ms = new MemoryStream(buffer);
            using CryptoStream cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read);
            using StreamReader sr = new StreamReader(cs);

            return sr.ReadToEnd();
        }
    }
}

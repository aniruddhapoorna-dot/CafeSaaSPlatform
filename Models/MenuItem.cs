namespace CafeOrderSystem.Models
{
    public class MenuItem
    {
        public int id {  get; set; }
        public string name {  get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string category { get; set; } = string.Empty;
        public bool isAvailable { get; set; } = true;

    }
}

using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class SettingMenu
{
    public int Id { get; set; }

    public string? KeyName { get; set; }

    public string? Value { get; set; }
}
